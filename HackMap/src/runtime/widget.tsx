/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';

import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import FeatureLayer from 'esri/layers/FeatureLayer';
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
import {
  getLabelCIMSymbol,
  getLabelSVGSymbol,
  getPointGraphic,
  getPolylineSymbol,
  routeSVG,
  respondSVG,
  getSvgDataUrl,
} from '../../utils';
import { Point, Polyline } from 'esri/geometry';
import { FullWidthButton } from '../components/FullWidthButton';
import RouteModal from '../components/RouteModal';
import RespondModal from '../components/RespondModal';
import Home from 'esri/widgets/Home';
import esriConfig from 'esri/config';
import Query from 'esri/rest/support/Query';
import geometryEngine from 'esri/geometry/geometryEngineAsync';

interface MappedProps {
  activeType: string;
}

interface State {
  routeCalculation: 'idle' | 'calculating' | 'complete' | 'failed';
  isViewReady: boolean;
  showRouteModal: boolean;
  showResponseModal: boolean;
}

const USE_MOCKED_USER_LOCATION = true;

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & MappedProps, State> {
  private view: MapView;
  private map: Map;
  private locator: Locate;

  private providerFL: FeatureLayer;
  private serviceAreaFL: FeatureLayer;
  private routingTargetFL: FeatureLayer;

  // see end of file
  static mapExtraStateProps: (state: any) => MappedProps;

  constructor(props) {
    super(props);

    esriConfig.apiKey = this.props.config.apiKey;

    this.state = {
      routeCalculation: 'idle',
      isViewReady: false,
      showRouteModal: false,
      showResponseModal: false,
    };

    const routeAction = {
      title: 'Directions',
      id: 'routeIt',
      type: 'button' as const,
      image: getSvgDataUrl(routeSVG),
    };

    const respondAction = {
      title: 'Respond',
      id: 'respondIt',
      type: 'button' as const,
      image: getSvgDataUrl(respondSVG),
    };

    this.serviceAreaFL = new FeatureLayer({
      title: 'Provider Service Areas',
      url: this.props.config.serviceAreaURL,
      visible: false,
    });

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
                           return "#0FBA4E"
                         } 
                         return "#0FBA4E"
                        `,
          },
          {
            name: 'walkingIn',
            expression: `if ($feature.WalkInsAccepted == "Yes") {
                           return "#0FBA4E"
                         } 
                         return "#6B6B6B ";
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
                <p>Walk-ins Accepted: {WalkInsAccepted}</p>
                 `,
      },
    });

    this.routingTargetFL = new FeatureLayer({ url: this.props.config.routingTargetsURL });

    this.map = new Map({
      // basemap: 'streets-navigation-vector',
      // basemap: new Basemap({ portalItem: { id: '273bf8d5c8ac400183fc24e109d20bcf' } }), // from https://story.maps.arcgis.com/
      basemap: 'arcgis-community', // from doc
      // basemap: new Basemap({ portalItem: { id: '184f5b81589844699ca1e132d007920e' } }), // from doc
      layers: [this.serviceAreaFL, this.providerFL],
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
          breakpoint: false,
        },
      },
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
        this.view.graphics.removeAll();
        this.serviceAreaFL.visible = false;
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
    this.serviceAreaFL.visible = false;

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
        attributes: { route: 0 },
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
        addFeatures: [new Graphic({ attributes: { SiteID: feature.attributes.SiteID } })],
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
        <RouteModal
          toggle={this.closeSmartRouteModal}
          isOpen={this.state.showRouteModal}
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
    this.setState({ showRouteModal: true });
  };

  private closeSmartRouteModal = () => {
    this.setState({ showRouteModal: false });
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

    this.view.graphics.removeAll();
    this.serviceAreaFL.visible = false;

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

    const userLocationGraphic = getPointGraphic(userLocation.coords, '#62C1FB');

    const query = new Query({
      geometry: userLocationGraphic.geometry,
      returnGeometry: true,
      outFields: ['*'],
      orderByFields: ['ToBreak  '],
      where: `ToBreak <= ${5}`,
    });

    const resp = await this.serviceAreaFL.queryFeatures(query);
    console.log('Features', resp);

    this.serviceAreaFL.definitionExpression = `OBJECTID in (${resp.features.map((f) => f.attributes.OBJECTID)})`;
    this.serviceAreaFL.visible = true;

    const unionResp = await geometryEngine.union(resp.features.map((f) => f.geometry));

    this.view.goTo(unionResp.extent.expand(1.25));

    const providerQuery = new Query({
      geometry: unionResp,
      returnGeometry: true,
      orderByFields: ['TestsInStockPCR'],
      outFields: ['*'],
    });

    const providerResp = await this.providerFL.queryFeatures(providerQuery);
    const providerGraphic = getPointGraphic(providerResp.features[0].geometry, '#35AC46');

    const stops = new FeatureSet({ features: [userLocationGraphic, providerResp.features[0]] });

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
        attributes: { route: 0 },
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

      this.view.graphics.addMany([routePolyGraphic, userLocationGraphic, providerGraphic, travelTimeLabel]);

      this.view.popup.close();

      this.view.goTo(routePolyline.extent.expand(1.25));

      this.routingTargetFL.applyEdits({
        addFeatures: [new Graphic({ attributes: { SiteID: providerResp.features[0].attributes.SiteID } })],
      });

      this.setState({ routeCalculation: 'complete' });
    } catch (e) {
      console.error(e);
      this.setState({ routeCalculation: 'failed' });
    }

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
