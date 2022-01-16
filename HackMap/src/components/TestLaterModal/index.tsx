/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Modal, ModalBody, ModalHeader, Button } from 'jimu-ui';

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

interface State {
  // TODO:
}

export default class TestLaterModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      // TODO:
    };
  }

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalBody>
          <div style={{ textAlign: 'center' }}>
            <p>Coming Soon</p>
            <legend>Find an appointment</legend>
            <p>Avoid bouncing between websites with unclear availability and travel times</p>
          </div>
          <Button size="lg" block type="primary" onClick={this.props.toggle}>
            Get notified
          </Button>
          <br />
          <Button size="lg" block type="secondary" onClick={this.props.toggle}>
            Not right now
          </Button>
        </ModalBody>
      </Modal>
    );
  }
}
