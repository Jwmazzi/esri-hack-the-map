/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';
import { Button } from 'jimu-ui';

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
  getLabelSVGSymbol,
  getPointGraphic,
  getPolylineSymbol,
  routeSVG,
  respondSVG,
  getSvgDataUrl,
} from '../../utils';
import { Point, Polyline } from 'esri/geometry';
import RouteModal from '../components/RouteModal';
import RespondModal from '../components/RespondModal';
import Home from 'esri/widgets/Home';
import esriConfig from 'esri/config';
import Query from 'esri/rest/support/Query';
import geometryEngine from 'esri/geometry/geometryEngineAsync';
import Header from '../components/Header';
import ToastMessage from '../components/ToastMessage';
import * as  networkService from 'esri/rest/networkService';

interface State {
  routeCalculation: 'idle' | 'calculating' | 'complete' | 'failed';
  isViewReady: boolean;
  showRouteModal: boolean;
  showResponseModal: boolean;
}

const HEADER_HEIGHT = 56;

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  private view: MapView;
  private map: Map;
  private locator: Locate;

  private providerFL: FeatureLayer;
  private serviceAreaFL: FeatureLayer;
  private routingTargetFL: FeatureLayer;

  constructor(props) {
    super(props);

    esriConfig.apiKey = this.props.config.apiKey;

    this.USE_MOCKED_USER_LOCATION = this.checkURLParameter();

    this.state = {
      routeCalculation: 'idle',
      isViewReady: false,
      showRouteModal: false,
      showResponseModal: false,
      toastText: ""
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

    this.walkServiceAreaFL = new FeatureLayer({
      title: 'Provider Service Areas',
      url: this.props.config.walkSAURL,
      visible: false,
    });

    this.driveServiceAreaFL = new FeatureLayer({
      title: 'Provider Service Areas',
      url: this.props.config.driveSAURL,
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
                           return "Walk-ins Accepted"
                         } 
                         return "";
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
                <p style="color: green">{expression/walkingIn}</p>
                 `,
      },
    });

    this.routingTargetFL = new FeatureLayer({ url: this.props.config.routingTargetsURL });

    this.map = new Map({
      // basemap: 'streets-navigation-vector',
      // basemap: new Basemap({ portalItem: { id: '273bf8d5c8ac400183fc24e109d20bcf' } }), // from https://story.maps.arcgis.com/
      basemap: 'arcgis-community', // from doc
      // basemap: new Basemap({ portalItem: { id: '184f5b81589844699ca1e132d007920e' } }), // from doc
      layers: [this.providerFL],
    });
  }

  checkURLParameter() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('demo') === 'true') {
      return true;
    } else {
      return false;
    }

  }

  async componentDidMount() {
    this.view = new MapView({
      container: 'edit-map',
      map: this.map,
      zoom: 10,
      center: [-117.182541, 34.055569],
      padding: { top: HEADER_HEIGHT },
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

    const userLocation = this.USE_MOCKED_USER_LOCATION
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

      this.setToast("Address Copied to Clipboard", 2);
      navigator.clipboard.writeText(feature.attributes.SiteAddress);

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
        <Header height={HEADER_HEIGHT} />
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
          <Button
            size="lg"
            type="primary"
            style={{ width: '100%', maxWidth: '360px' }}
            onClick={this.openSmartRouteModal}
          >
            SmartRoute
          </Button>
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
        <ToastMessage
          toastText={this.state.toastText}
        />
      </div>
    );
  }

  private setToast = (message, duration) => {

    this.setState({
      toastText: message
    });

    setTimeout(() => {
      this.setState({
        toastText: ""
      });
    }, duration * 1000);

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

    const transportMethod = info.transportMethod === "driving" ? "Driving Time" : "Walking Time";

    console.log({ info });
    // TODO: use info
    const userLocation = this.USE_MOCKED_USER_LOCATION
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

    const saQuery = new Query({
      geometry: userLocationGraphic.geometry,
      returnGeometry: true,
      outFields: ['*'],
      orderByFields: ['ToBreak'],
      where: `ToBreak <= ${info.maxTime}`,
    });

    const saTarget = transportMethod === "Driving Time" ? this.driveServiceAreaFL : this.walkServiceAreaFL;
    const resp = await saTarget.queryExtent(saQuery);
    console.log("SA", resp)

    if (!resp.extent) {

      this.setToast("SmartRoute Not Ready for Your Area!", 3)
      return;

    }

    const providerQuery = new Query({
      geometry: resp.extent,
      returnGeometry: true,
      outFields: ['*']
    })

    if (info.searchFor.includes('testingKits')) {
      providerQuery.orderByFields = ['TestsInStockPCR DESC', 'TestsInStockRapid DESC'];
    }

    if (info.searchFor.includes('inPersonTest')) {
      providerQuery.where = "WalkInsAccepted = 'Yes'"
    } else {
      providerQuery.where = "1=1"
    }

    console.log(providerQuery)

    const providerResp = await this.providerFL.queryFeatures(providerQuery);

    const providerGraphic = getPointGraphic(providerResp.features[0].geometry as Point, '#35AC46');

    console.log(providerResp)

    const stops = new FeatureSet({ features: [userLocationGraphic, providerResp.features[0]] });

    const serviceDescription = await networkService.default.fetchServiceDescription(this.props.config.routingURL, this.props.config.apiKey);
    const { supportedTravelModes } = serviceDescription;
    const driveTimeTravelMode = supportedTravelModes.find((mode) => mode.name === transportMethod);

    const routeParams = new RouteParameters({
      travelMode: driveTimeTravelMode,
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

      const travelTime = transportMethod === "Driving Time" ? 
      routePolyGraphic.attributes.Total_TravelTime : routePolyGraphic.attributes.Total_WalkTime;

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
        symbol: getLabelSVGSymbol(`${Math.ceil(travelTime)} min`),
      });

      this.view.graphics.addMany([routePolyGraphic, userLocationGraphic, providerGraphic, travelTimeLabel]);

      this.view.popup.close();

      this.view.goTo(routePolyline.extent.expand(1.25));

      this.setToast("Address Copied to Clipboard", 3);
      navigator.clipboard.writeText(providerResp.features[0].attributes.SiteAddress);

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
