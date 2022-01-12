/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';

import Map from 'esri/Map';
import MapView from 'esri/views/MapView';

export default class Widget extends React.PureComponent<AllWidgetProps<{}>, any> {
  private view: MapView;
  private map: Map;

  constructor(props) {
    super(props);

    // TODO - Get Hosted Feature Layer URLS from Craig and Define Them Here
    this.map = new Map({
      basemap: 'streets-navigation-vector',
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
  }

  render() {
    return <div className="widget-hack-map" id="edit-map" style={{ height: '100%' }}></div>;
  }
}
