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
import { getLabelCIMSymbol, getLabelSVGSymbol, getPointGraphic, getPolylineSymbol, routeSVG, respondSVG, getSvgDataUrl } from '../../utils';
import { Point, Polyline } from 'esri/geometry';
import { FullWidthButton } from '../components/FullWidthButton';
import HackModal from '../components/HackModal';
import RespondModal from '../components/RespondModal';
import utils from 'esri/smartMapping/raster/support/utils';
import Home from 'esri/widgets/Home';
import esriConfig from 'esri/config';

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

    esriConfig.apiKey = this.props.config.apiKey;

    this.state = {
      routeCalculation: 'idle',
      isViewReady: false,
      showModal: false,
      showResponseModal: false,
    };

    const routeAction = {
      title: 'Directions',
      id: 'routeIt',
      image: getSvgDataUrl(routeSVG)
    };

    const respondAction = {
      title: 'Respond',
      id: 'respondIt',
      image: getSvgDataUrl(respondSVG)
    };

    this.providerFL = new FeatureLayer({
      title: 'SB County Providers',
      url: this.props.config.providerURL,
      outFields: ['*'],
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

    this.routingTargetFL = new FeatureLayer({url: this.props.config.routingTargetsURL});

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
      popup: {
        dockEnabled: false,
        collapseEnabled: false,
        dockOptions: {
          buttonEnabled: false,
          position: 'bottom-right',
          breakpoint: false
        }
      }
    });

    await this.view.when();
    this.setState({ isViewReady: true });

    this.view.popup.on('trigger-action', (event) => {
      if (event.action.id === 'routeIt') {
        this.handleRouting();
      }
      if (event.action.id === 'respondIt') {
        this.openRespondModal();
        this.view.popup.close();
      }
    });

    this.locator = new Locate({ view: this.view });
    this.view.ui.add(this.locator, 'top-left');
    
    const home = new Home({ view: this.view });
    this.view.ui.add(home, 'top-left');

  }

  async handleRouting() {
    this.setState({ routeCalculation: 'calculating' });

    this.view.graphics.removeAll();
    
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
      apiKey: this.props.config.apiKey,
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
      const routePolyline = routePolyGraphic.geometry as Polyline;

      const targetIndex = Math.floor(routePolyline.paths[0].length / 2);
      const targetGeom = routePolyline.paths[0][targetIndex];

      const travelTimeLabel = new Graphic({
        attributes: {'route': 0},
        geometry: {
          // @ts-expect-error auto cast
          type: 'point',
          x: targetGeom[0],
          y: targetGeom[1],
          spatialReference: {
            wkid: 3857,
          },
        },
        // symbol: getLabelCIMCIMSymbol(`${Math.ceil(routePolyGraphic.attributes.Total_TravelTime)} min`),
        symbol: getLabelSVGSymbol(`${Math.ceil(routePolyGraphic.attributes.Total_TravelTime)} min`),
      });

      this.view.graphics.addMany([routePolyGraphic, origPointGraphic, destPointGraphic, travelTimeLabel]);

      this.view.popup.close();

      this.view.goTo(routePolyline.extent.expand(1.25));

      this.routingTargetFL.applyEdits({
        addFeatures: [new Graphic({attributes: {SiteID: feature.attributes.SiteID}})]
      });

      this.setState({ routeCalculation: 'complete' });
    } catch (e) {
      console.error(e);
      this.setState({ routeCalculation: 'failed' });
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
          config={this.props.config}
          siteFeature={this.view != undefined ? this.view.popup.selectedFeature : -1}
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

    const userLocationGraphic = getPointGraphic(userLocation.coords);

    const serviceAreaParameters = new ServiceAreaParameters({
      apiKey: this.props.config.apiKey,
      facilities: new FeatureSet({
        features: [userLocationGraphic],
      }),
      defaultBreaks: [2.5],
      travelMode: { type: 'automobile' },
      travelDirection: 'to-facility',
      outSpatialReference: { wkid: 3857 },
      trimOuterPolygon: true,
    });

    const resp = await serviceArea.solve(
      'https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea',
      serviceAreaParameters
    );
    console.log(resp);

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
