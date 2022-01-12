/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core';
import { IMConfig } from '../config';

import TestSelect from '../components/TestSelect';

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor (props) {
    super(props)

    this.state = {
      
    }
  }

  render () {
    return (
      <TestSelect />
    )
  }
}
