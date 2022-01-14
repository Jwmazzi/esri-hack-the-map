/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from 'jimu-core';
import { IMConfig } from '../config';

import { Container } from 'jimu-ui';

import TestSelect from '../components/TestSelect';
import TypeNavbar from '../components/TypeNavbar';

const ALL_TYPES = ['Test Now', 'Test Later'];

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor(props) {
    super(props);

    this.state = {
      activeType: ALL_TYPES[0],
    };
  }

  onClick = (activeType) => {
    this.setState({
      activeType,
    });

    this.props.dispatch(appActions.widgetStatePropChange('hack', 'activeType', activeType));
  };

  render() {
    return (
      <Container style={{ boxShadow: '0px 1px 0px #cacaca' }}>
        <TypeNavbar onClick={this.onClick} currentType={this.state.activeType} allTypes={ALL_TYPES} />
      </Container>
      // <TestSelect onClick={this.onClick} />
    );
  }
}
