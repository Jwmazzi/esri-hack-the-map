/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'jimu-ui';
import { FullWidthButton } from '../FullWidthButton';

interface Props {
  toggle: () => void;
  isOpen: boolean;
  onSubmit: (info: { searchFor: string[]; transportMethod: 'walking' | 'driving'; maxTime: number }) => void;
}

interface State {
  // TODO:
}

export default class RespondModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      //   TODO:
    };
  }

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalHeader toggle={this.props.toggle}>Facility Status</ModalHeader>
        <ModalBody>I'm searching for...</ModalBody>
        <ModalFooter>
          <FullWidthButton onClick={this.handleSubmitSmartRoute}>Submit Response</FullWidthButton>
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
