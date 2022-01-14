/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Modal, ModalBody, ModalHeader, Button } from 'jimu-ui';


export default class RespondModal extends React.PureComponent<Props, State> {
  
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalBody>
          <div style={{textAlign: "center"}}>
            <p>Coming Soon</p>
            <legend>Find an appointment</legend>
            <p>Avoid bouncing between websites with unclear availability and travel times</p>
          </div>
          <Button block type="primary">Get notified</Button>
          <br/>
          <Button block type="secondary">Not right now</Button>
        </ModalBody>
      </Modal>
    );
  }

}
