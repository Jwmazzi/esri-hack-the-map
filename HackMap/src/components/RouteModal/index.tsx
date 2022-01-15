/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Checkbox, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'jimu-ui';
import { FullWidthButton } from '../FullWidthButton';

interface Props {
  toggle: () => void;
  isOpen: boolean;
  onSubmit: (info: { searchFor: string[]; transportMethod: 'walking' | 'driving'; maxTime: number }) => void;
}

interface State {
  isCheckedForTestingKits: boolean;
  isCheckedForInPerson: boolean;
}

export default class HackModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isCheckedForTestingKits: true,
      isCheckedForInPerson: true,
    };
  }

  render() {
    const labelTextStyle = {
      fontSize: '14px',
      lineHeight: '16px',
      color: '#151515',
      margin: '0px 8px',
    };

    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalHeader style={{ padding: '32px 32px 24px', border: 0 }} toggle={this.props.toggle}>
          <span
            style={{
              fontWeight: '600',
              fontSize: '26px',
              lineHeight: '32px',
              color: '#35AC46',
            }}
          >
            SmartRoute
          </span>
        </ModalHeader>
        <ModalBody style={{ padding: '0 32px' }}>
          <div style={{ fontSize: '16px', lineHeight: '20px', fontWeight: '600', color: '#000000' }}>
            I'm searching for...
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '16px', margin: '16px 0' }}>
            <li>
              <Label centric check>
                <Checkbox checked={this.state.isCheckedForTestingKits} onChange={this.handleChangeForTestingKits} />
                <span style={labelTextStyle}>Testing Kits</span>
              </Label>
            </li>
            <li>
              <Label centric check>
                <Checkbox checked={this.state.isCheckedForInPerson} onChange={this.handleChangeForInPerson} />
                <span style={labelTextStyle}> In-Person Test (Walk in)</span>
              </Label>
            </li>
          </ul>
        </ModalBody>
        <ModalFooter style={{ padding: '32px' }}>
          <FullWidthButton onClick={this.handleSubmitSmartRoute}>Create route</FullWidthButton>
        </ModalFooter>
      </Modal>
    );
  }

  handleChangeForTestingKits = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ isCheckedForTestingKits: checked });
  };

  handleChangeForInPerson = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ isCheckedForInPerson: checked });
  };

  private handleSubmitSmartRoute = () => {
    // TODO: connect these with states
    this.props.onSubmit({
      searchFor: [
        ...(this.state.isCheckedForTestingKits ? ['testingKits'] : []),
        ...(this.state.isCheckedForInPerson ? ['inPersonTest'] : []),
      ],
      transportMethod: 'driving',
      maxTime: 60, // min
    });
    this.props.toggle();
  };
}
