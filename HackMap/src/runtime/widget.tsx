/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";


export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {

  constructor (props) {

    super(props)

    this.view = undefined;

    // TODO - Get Hosted Feature Layer URLS from Craig and Define Them Here 
   
    this.map = new Map({
      basemap: "dark-gray-vector"
    });

    this.state = {}

  }

  componentDidMount() {

    this.view = new MapView({
      container: "edit-map",
      map: this.map,
      zoom: 12,
      center: [-119, 36],
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          position: 'bottom-right',
          breakpoint: false
        }
      }
    });
  }

  render () {
    return <div id="edit-map" style={{height: '100%'}}></div>
  }
}
