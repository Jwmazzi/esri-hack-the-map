/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from 'jimu-core';
import { IMConfig } from '../config';

import { Container } from 'jimu-ui';

import TypeNavbar from '../components/TypeNavbar';
import TestLaterModal from '../components/TestLaterModal';

const ALL_TYPES = ['Test Now', 'Test Later'];

/** @deprecated */
export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor(props) {
    super(props);

    this.state = {
      activeType: ALL_TYPES[0],
      showModal: false,
    };
  }

  onClick = (activeType) => {
    if (activeType == 'Test Later') {
      this.setState({
        showModal: true,
      });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    return (
      <Container style={{ boxShadow: 'inset 0px -1px 0px #cacaca' }}>
        <TestLaterModal toggle={this.closeModal} isOpen={this.state.showModal} />
        <TypeNavbar onClick={this.onClick} currentType={this.state.activeType} allTypes={ALL_TYPES} />
      </Container>
      // <TestSelect onClick={this.onClick} />
    );
  }
}
