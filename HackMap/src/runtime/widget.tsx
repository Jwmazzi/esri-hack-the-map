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

import { IMConfig } from '../config';
import RouteParameters from 'esri/rest/support/RouteParameters';
import { getPointGraphic, getPolylineSymbol } from '../../utils';
import { Point, Polyline } from 'esri/geometry';

interface MappedProps {
  activeType: string;
}

interface State {
  routeCalculation: 'idle' | 'calculating' | 'complete' | 'failed';
  isViewReady: boolean;
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
    });

    const layerList = new LayerList({
      view: this.view,
    });

    this.locator = new Locate({ view: this.view, goToLocationEnabled: false });

    this.view.ui.add(this.locator, 'top-left');

    // this.view.ui.add(layerList, { position: 'top-right' });
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

      this.view.graphics.add(routePolyGraphic);
      this.view.graphics.addMany([routePolyGraphic, origPointGraphic, destPointGraphic]);

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
    return <div className="widget-hack-map" id="edit-map" style={{ height: '100%' }}></div>;
  }
}

Widget.mapExtraStateProps = (state) => {
  if (state.widgetsState.hack) {
    return {
      activeType: state.widgetsState.hack.activeType,
    };
  }
};
