/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'jimu-ui';

interface Props {
  toggle: () => void;
  isOpen: boolean;
  onSubmit: (info: { searchFor: string[]; transportMethod: 'walking' | 'driving'; maxTime: number }) => void;
}

interface State {
  // TODO:
}

export default class HackModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      //   TODO:
    };
  }

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalHeader toggle={this.props.toggle}>SmartRoute</ModalHeader>
        <ModalBody>I'm searching for...</ModalBody>
        <ModalFooter>
          <Button size="lg" block type="primary" onClick={this.handleSubmitSmartRoute}>
            Create route
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  private handleSubmitSmartRoute = () => {
    // TODO: connect these with states
    this.props.onSubmit({
      searchFor: ['testingKits', 'inPersonTest'],
      transportMethod: 'driving',
      maxTime: 60, // min
    });
    this.props.toggle();
  };
}
