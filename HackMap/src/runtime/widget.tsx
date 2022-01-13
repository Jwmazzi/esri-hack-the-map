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

import { IMConfig } from '../config';
import RouteParameters from 'esri/rest/support/RouteParameters';
import { features } from 'process';


interface MappedProps {
  activeType: string;
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & MappedProps, any> {
  private view: MapView;
  private map: Map;
  private providerFL: FeatureLayer;
  private locator: Locate;

  // see end of file
  static mapExtraStateProps: (state: any) => MappedProps;

  constructor(props) {
    super(props);

    const routeAction = {
      title: "Directions",
      id: "routeIt",
    };

    const respondAction = {
      title: "Respond",
      id: "respondIt"
    }
    

    this.providerFL = new FeatureLayer({
      title: "SB County Providers",
      url: this.props.config.providerURL,
      popupTemplate: {
        title: '{SiteName}',
        lastEditInfoEnabled: false,
        actions: [
          routeAction,
          respondAction
        ]
        expressionInfos: [
          {
            name: "testingKits",
            expression: `var sum = $feature.TestsInStockPCR + $feature.TestsInStockRapid;
                         if (sum <= 50) {
                           return "red"
                         } 
                         return "green"
                        `
          },
          {
            name: "walkingIn",
            expression: `var sum = $feature.TestsInStockPCR + $feature.TestsInStockRapid;
                         if ($feature.WalkInsAccepted == "Yes") {
                           return "green";
                         } 
                         return "red";
                        `
          },
          {
            name: "editElapse",
            expression: `return Round(DateDiff(Now(), Date($feature.LastUpdateDate), "hours"));`
          }
        ],
        content: `
                <p style="margin: auto">{SiteAddress}</p>
                <p>Last Updated {expression/editElapse} Hours Ago</p>
                <table>
                  <tr>
                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/walkingIn}"></span></td>
                    <td><p style="margin: auto; padding-left: 10px">Testing Kits</p></td>
                  </tr>
                  <tr>
                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/testingKits}"></span></td>
                    <td><p style="margin: auto; padding-left: 10px">Walk-ins Accepted</p></td>
                  </tr>
                </table>
                 `
      }
    });

    this.map = new Map({
      basemap: 'streets-navigation-vector',
      layers: [this.providerFL],
    });

    this.state = {
      isViewReady: false,
    };
  }

  async componentDidMount() {

    this.view = new MapView({
      container: 'edit-map',
      map: this.map,
      zoom: 10,
      center: [-117.182541, 34.055569]
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

    this.locator = new Locate({view: this.view});

    this.view.ui.add(this.locator, 'top-left');

    // this.view.ui.add(layerList, { position: 'top-right' });
  }

  async handleRouting() {

    const feature = this.view.popup.selectedFeature;
    // console.log(feature)
    // console.log(feature.geometry)
    // console.log(feature.properties)

    // let point = {
    //   type: "point",
    //   x: feature.geometry.longitude,
    //   y: feature.geometry.latitude
    // };

    // let markerSymbol = {
    //   type: "simple-marker",
    //   color: [226, 119, 40]
    // };

    // const start = new Graphic({
    //   geometry: point,
    //   symbol: markerSymbol
    // });

    this.locator.goToLocationEnabled = false;

    const resp = await this.locator.locate();
    console.log(resp)
    
    let userPoint = {
      type: "point",
      x: resp.longitude,
      y: resp.latitude,
      spatialReference: {
        wkid: 4326
      }
    };

    let userMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40]
    };

    const stop = new Graphic({
      geometry: userPoint,
      symbol: userMarkerSymbol
    });

    const nodes = new FeatureSet({features: [stop]});

    const routeParams = new RouteParameters({
      apiKey: "",
      stops: nodes,
      outSpatialReference: {
        wkid: 3857
      }

    });

    var x = await route.solve("https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", routeParams)
    console.log(x)

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
