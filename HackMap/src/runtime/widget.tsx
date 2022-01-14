/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';

import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import LayerList from 'esri/widgets/LayerList';
import Locate from 'esri/widgets/Locate';
import route from 'esri/rest/route';
import Graphic from 'esri/Graphic';
import FeatureSet from 'esri/rest/support/FeatureSet';
import RouteResult from 'esri/rest/support/RouteResult';
import ServiceAreaParameters from 'esri/rest/support/ServiceAreaParameters';
import TravelMode from 'esri/rest/support/TravelMode';
import serviceArea from 'esri/rest/serviceArea';
import { IMConfig } from '../config';
import RouteParameters from 'esri/rest/support/RouteParameters';
import { getPointGraphic, getPolylineSymbol } from '../../utils';
import { Point, Polyline } from 'esri/geometry';
import { FullWidthButton } from '../components/FullWidthButton';
import HackModal from '../components/HackModal';
import RespondModal from '../components/RespondModal';
import CIMSymbol from 'esri/symbols/CIMSymbol';

interface MappedProps {
  activeType: string;
}

interface State {
  routeCalculation: 'idle' | 'calculating' | 'complete' | 'failed';
  isViewReady: boolean;
  showModal: boolean;
  showResponseModal: boolean;
}

const USE_MOCKED_USER_LOCATION = true;

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & MappedProps, State> {
  private view: MapView;
  private map: Map;
  private providerFL: FeatureLayer;
  private locator: Locate;

  // see end of file
  static mapExtraStateProps: (state: any) => MappedProps;

  constructor(props) {
    super(props);

    this.state = {
      routeCalculation: 'idle',
      isViewReady: false,
      showModal: false,
      showResponseModal: false,
    };

    const routeAction = {
      title: 'Directions',
      id: 'routeIt',
    };

    const respondAction = {
      title: 'Respond',
      id: 'respondIt',
    };

    this.providerFL = new FeatureLayer({
      title: 'SB County Providers',
      url: this.props.config.providerURL,
      popupTemplate: {
        title: '{SiteName}',
        lastEditInfoEnabled: false,
        actions: [routeAction, respondAction],
        expressionInfos: [
          {
            name: 'testingKits',
            expression: `var sum = $feature.TestsInStockPCR + $feature.TestsInStockRapid;
                         if (sum <= 50) {
                           return "red"
                         } 
                         return "green"
                        `,
          },
          {
            name: 'walkingIn',
            expression: `if ($feature.WalkInsAccepted == "Yes") {
                           return "green";
                         } 
                         return "red";
                        `,
          },
          {
            name: 'editElapse',
            expression: `return Round(DateDiff(Now(), Date($feature.LastUpdateDate), "hours"));`,
          },
        ],
        content: `
                <p style="margin: auto">{SiteAddress}</p>
                <p>Last Updated {expression/editElapse} Hours Ago</p>
                <table>
                  <tr>
                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/testingKits}"></span></td>
                    <td><p style="margin: auto; padding-left: 10px">Testing Kits</p></td>
                  </tr>
                  <tr>
                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/walkingIn}"></span></td>
                    <td><p style="margin: auto; padding-left: 10px">Walk-ins Accepted</p></td>
                  </tr>
                </table>
                 `,
      },
    });

    this.map = new Map({
      // basemap: 'streets-navigation-vector',
      // basemap: new Basemap({ portalItem: { id: '273bf8d5c8ac400183fc24e109d20bcf' } }), // from https://story.maps.arcgis.com/
      basemap: 'arcgis-community', // from doc
      // basemap: new Basemap({ portalItem: { id: '184f5b81589844699ca1e132d007920e' } }), // from doc
      layers: [this.providerFL],
    });
  }

  async componentDidMount() {
    this.view = new MapView({
      container: 'edit-map',
      map: this.map,
      zoom: 10,
      center: [-117.182541, 34.055569],
    });

    await this.view.when();
    this.setState({ isViewReady: true });

    this.view.popup.on('trigger-action', (event) => {
      if (event.action.id === 'routeIt') {
        this.handleRouting();
      }
      if (event.action.id === "respondIt") {
        this.submitFeedback();
      }
    });

    const layerList = new LayerList({
      view: this.view,
    });

    this.locator = new Locate({ view: this.view, goToLocationEnabled: false });

    this.view.ui.add(this.locator, 'top-left');

    // this.view.ui.add(layerList, { position: 'top-right' });
  }

  submitFeedback() {

    this.openRespondModal();
    
  }

  async handleRouting() {
    this.setState({ routeCalculation: 'calculating' });

    const feature = this.view.popup.selectedFeature;
    const userLocation = USE_MOCKED_USER_LOCATION
      ? { coords: { longitude: -117.182541, latitude: 34.055569 } }
      : await this.locator.locate();

    if (!userLocation || !feature) {
      this.setState({ routeCalculation: 'failed' });
      // TODO: inform the user it's failing
      return;
    }

    // userLocation is a `GeolocationCoordinates`:
    // coords: {
    //   accuracy: 20.398;
    //   altitude: null;
    //   altitudeAccuracy: null;
    //   heading: null;
    //   latitude: 34.1005943;
    //   longitude: -118.3173789;
    //   speed: null;
    // }

    const destPoint = feature.geometry as Point;
    const origPointGraphic = getPointGraphic(userLocation.coords, '#62C1FB');
    const destPointGraphic = getPointGraphic(destPoint, '#35AC46');

    // from user location to selected feature
    const stops = new FeatureSet({ features: [origPointGraphic, destPointGraphic] });

    const routeParams = new RouteParameters({
      apiKey: '',
      stops,
      outSpatialReference: {
        wkid: 3857,
      },
      directionsOutputType: 'standard',
      returnDirections: true,
    });

    try {
      const routingResponse = await route.solve(
        'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
        routeParams
      );

      // @ts-expect-error - mismatching types
      const routeResult: RouteResult = routingResponse.routeResults[0];

      const routePolyGraphic = routeResult.route;
      routePolyGraphic.symbol = getPolylineSymbol();

      const targetIndex  = Math.floor(routePolyGraphic.geometry.paths[0].length / 2);
      const targetGeom   = routePolyGraphic.geometry.paths[0][targetIndex];
      console.log(targetGeom);

      const symbol = {
        type: "cim",
        data: {
          type: "CIMSymbolReference",
          symbol: {
            type: "CIMPointSymbol",
            symbolLayers: [
              {
                type: "CIMVectorMarker",
                enable: true,
                size: 10.5,
                colorLocked: true,
                anchorPointUnits: "Relative",
                frame: {
                  xmin: 0,
                  ymin: -5.25,
                  xmax: 0,
                  ymax: 5.25
                },
                markerGraphics: [
                  {
                    type: "CIMMarkerGraphic",
                    geometry: {
                      x: targetGeom[0],
                      y: targetGeom[1]
                    },
                    symbol: {
                      type: "CIMTextSymbol",
                      fontFamilyName: "Avenir Next LT Pro Regular",
                      fontStyleName: "normal",
                      height: 10.5,
                      horizontalAlignment: "Center",
                      offsetX: 0,
                      offsetY: 19.5,
                      symbol: {
                        type: "CIMPolygonSymbol",
                        symbolLayers: [
                          {
                            type: "CIMSolidFill",
                            enable: true,
                            color: [255, 255, 255, 255]
                          }
                        ]
                      },
                      verticalAlignment: "Center",
                      font: {
                        family: "Avenir Next LT Pro Regular",
                        decoration: "none",
                        style: "normal",
                        weight: "normal"
                      }
                    },
                    textString: `${routePolyGraphic.attributes.Total_TravelTime} Minutes`
                  }
                ],
                scaleSymbolsProportionally: true,
                respectFrame: true
              },
              {
                type: "CIMVectorMarker",
                enable: true,
                anchorPointUnits: "Relative",
                size: 39,
                frame: {
                  xmin: 0,
                  ymin: 0,
                  xmax: 136.5,
                  ymax: 39
                },
                markerGraphics: [
                  {
                    type: "CIMMarkerGraphic",
                    geometry: {
                      rings: [
                        [
                          [0, 39],
                          [136.5, 39],
                          [136.5, 0],
                          [0, 0],
                          [0, 39]
                        ]
                      ]
                    },
                    symbol: {
                      type: "CIMPolygonSymbol",
                      symbolLayers: [
                        {
                          type: "CIMSolidFill",
                          enable: true,
                          color: [2, 0, 28, 255]
                        }
                      ]
                    }
                  }
                ],
                scaleSymbolsProportionally: false,
                respectFrame: true,
                offsetX: 0,
                offsetY: 19.5,
                anchorPoint: {
                  x: 0,
                  y: 0
                },
                rotateClockwise: false
              }
            ]
          }
        }
      };

      const g = new Graphic({
        geometry: {
          type: 'point',
          x: targetGeom[0],
          y: targetGeom[1],
          spatialReference: {
            wkid: 3857
          }
        },
        symbol: symbol
      })

      this.view.graphics.addMany([routePolyGraphic, origPointGraphic, destPointGraphic, g]);

      this.view.goTo(routePolyGraphic.geometry.extent);

      this.setState({ routeCalculation: 'complete' });
    } catch (e) {
      console.error(e);
      this.setState({ routeCalculation: 'failed' });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeType) {
      this.providerFL.definitionExpression = `SiteType = '${this.props.activeType}'`;
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div className="widget-hack-map" id="edit-map" style={{ height: '100%' }}></div>
        <div
          className="button-container"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            padding: '0 32px 24px',
          }}
        >
          <FullWidthButton onClick={this.openSmartRouteModal}>SmartRoute</FullWidthButton>
        </div>
        <HackModal
          toggle={this.closeSmartRouteModal}
          isOpen={this.state.showModal}
          onSubmit={this.handleSubmitSmartRoute}
        />
        <RespondModal
          toggle={this.closeRespondModal}
          isOpen={this.state.showResponseModal}
          onSubmit={this.handleSubmitSmartRoute}
        />
      </div>
    );
  }

  private openSmartRouteModal = () => {
    this.setState({ showModal: true });
  };

  private closeSmartRouteModal = () => {
    this.setState({ showModal: false });
  };

  private openRespondModal = () => {
    this.setState({ showResponseModal: true });
  };

  private closeRespondModal = () => {
    this.setState({ showResponseModal: false });
  };


  private handleSubmitSmartRoute = async (info: {
    searchFor: string[];
    transportMethod: 'walking' | 'driving';
    maxTime: number;
  }) => {
    console.log({ info });
    // TODO: use info
    const userLocation = USE_MOCKED_USER_LOCATION
    ? { coords: { longitude: -117.182541, latitude: 34.055569 } }
    : await this.locator.locate();

    // userLocation is a `GeolocationCoordinates`:
    // coords: {
    //   accuracy: 20.398;
    //   altitude: null;
    //   altitudeAccuracy: null;
    //   heading: null;
    //   latitude: 34.1005943;
    //   longitude: -118.3173789;
    //   speed: null;
    // }

    const g = new Graphic({
      geometry: {
        type: 'point',
        x: userLocation.coords.longitude,
        y: userLocation.coords.latitude,
        spatialReference: {
          wkid: 4326
        }
      }
    })

    // const facility = new FeatureSet({
    //   features: [g]
    // })

    const serviceAreaParameters = new ServiceAreaParameters({
      apiKey: '',
      facilities: new FeatureSet({
        features: [g]
      }),
      defaultBreaks: [2.5],
      travelMode: { type: 'automobile' },
      travelDirection: "to-facility",
      outSpatialReference: {wkid: 3857},
      trimOuterPolygon: true
    });

    const resp = await serviceArea.solve(
      'https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea', 
      serviceAreaParameters
      )
    console.log(resp)
    

    this.closeSmartRouteModal();
  };
}

Widget.mapExtraStateProps = (state) => {
  if (state.widgetsState.hack) {
    return {
      activeType: state.widgetsState.hack.activeType,
    };
  }
};
