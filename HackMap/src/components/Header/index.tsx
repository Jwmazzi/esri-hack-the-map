/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Container } from 'jimu-ui';

import { Logo } from '../Logo';
import TestLaterModal from '../TestLaterModal';
import TypeNavbar from '../TypeNavbar';

const ALL_TYPES = ['Test Now', 'Test Later'] as const;
interface Props {
  /** in px */
  height: number;
}
interface State {
  activeType: typeof ALL_TYPES[number];
  showModal: boolean;
}

export default class Header extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      activeType: ALL_TYPES[0],
      showModal: false,
    };
  }

  handleChangeType = (activeType: State['activeType']) => {
    this.setState({ activeType });

    if (activeType == 'Test Later') {
      this.setState({ showModal: true });
    }
  };

  closeModal = () => {
    this.setState({ showModal: false, activeType: ALL_TYPES[0] });
  };

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          background: '#fff',
          top: 0,
          width: '100%',
          height: this.props.height,
          boxShadow: 'inset 0 -1px 0 0 #cacaca',
          display: 'grid',
          gridTemplateColumns: `${this.props.height}px auto ${this.props.height}px`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Logo />
        </div>
        <div>
          <Container>
            <TypeNavbar onClick={this.handleChangeType} currentType={this.state.activeType} allTypes={ALL_TYPES} />
          </Container>
          <TestLaterModal toggle={this.closeModal} isOpen={this.state.showModal} />
        </div>
        <div>{/* placeholder for account button */}</div>
      </div>
      //
      //     <TestLaterModal toggle={this.closeModal} isOpen={this.state.showModal} />
      //
      //   </Container>
      // <TestSelect onClick={this.onClick} />
    );
  }
}
