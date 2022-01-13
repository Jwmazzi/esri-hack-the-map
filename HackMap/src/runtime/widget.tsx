/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';

import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import LayerList from 'esri/widgets/LayerList';
import { IMConfig } from '../config';

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  private view: MapView;
  private map: Map;
  private providerFL: FeatureLayer;

  constructor(props) {
    super(props);

    this.providerFL = new FeatureLayer({
      title: 'SB County Providers',
      url: this.props.config.providerURL,
      popupTemplate: {
        title: '{Site Name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'TestsInStockPCR',
                label: 'PCR Tests In Stock',
              },
              {
                fieldName: 'TestsInStockRapid',
                label: 'Rapid Tests In Stock',
              },
            ],
          },
        ],
      },
    });

    // TODO - Get Hosted Feature Layer URLS from Craig and Define Them Here
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
      center: [-117.182541, 34.055569],
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          position: 'bottom-right',
          breakpoint: false,
        },
      },
    });

    await this.view.when();
    this.setState({ isViewReady: true });

    const layerList = new LayerList({
      view: this.view,
    });

    this.view.ui.add(layerList, { position: 'top-right' });
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
