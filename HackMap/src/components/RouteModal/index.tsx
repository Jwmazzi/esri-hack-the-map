/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Checkbox, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, Collapse, Button } from 'jimu-ui';

interface Props {
  toggle: () => void;
  isOpen: boolean;
  onSubmit: (info: { searchFor: string[]; transportMethod: 'walking' | 'driving'; maxTime: number }) => void;
}

interface State {
  isCheckedForTestingKits: boolean;
  isCheckedForInPerson: boolean;
  transportMethod: 'driving' | 'walking';
  maxTime: number;
  showRouteOptions: boolean;
}

export default class HackModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isCheckedForTestingKits: true,
      isCheckedForInPerson: true,
      transportMethod: 'driving',
      maxTime: 20,
      showRouteOptions: false,
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
            I'm searching for
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
          {this.renderRouteOptionsCollapse()}
        </ModalBody>
        <ModalFooter style={{ padding: '32px' }}>
          <Button size="lg" block type="primary" onClick={this.handleSubmitSmartRoute}>
            Create route
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  renderRouteOptionsCollapse = () => {
    const labelTextStyle = {
      fontSize: '16px',
      lineHeight: '20px',
      color: '#151515',
    };
    const routeOptions = (
      <div style={{ display: 'grid', gap: '20px' }}>
        <div>
          <span style={labelTextStyle}>Transport method</span>
          <Select
            a11y-description="Please pick a transport method"
            hasContent
            onChange={this.handleChangeForTransportMethod}
            value={this.state.transportMethod}
          >
            <Option value="driving">Driving</Option>
            <Option value="walking">Walking</Option>
          </Select>
        </div>
        <div>
          <span style={labelTextStyle}>Max time</span>
          <Select
            a11y-description="Please pick a max time for travel"
            hasContent
            onChange={this.handleChangeForMaxTime}
            value={this.state.maxTime}
          >
            {Array(11)
              .fill(0)
              .map((_, index) => (index + 1) * 5) // [5, 10, ..., 60];
              .map((timeOption) => (
                <Option key={timeOption} value={timeOption}>{`${timeOption} min`}</Option>
              ))}
          </Select>
        </div>
      </div>
    );

    return (
      <div style={{ marginTop: '24px' }}>
        <Button
          type="tertiary"
          size="lg"
          onClick={this.handleCollapseToggle}
          style={{ width: '100%', paddingLeft: 0, paddingRight: 0, textAlign: 'start' }}
        >
          <span
            className={`esri-icon ${this.state.showRouteOptions ? 'esri-icon-down' : 'esri-icon-right'}`}
            style={{ fontSize: '10px', marginRight: '8px' }}
          />
          {'Route options'}
        </Button>
        <Collapse style={{ marginTop: '12px' }} isOpen={this.state.showRouteOptions}>
          {routeOptions}
        </Collapse>
      </div>
    );
  };

  handleChangeForTestingKits = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ isCheckedForTestingKits: checked });
  };

  handleChangeForInPerson = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ isCheckedForInPerson: checked });
  };

  handleChangeForTransportMethod = (evt: any) => {
    this.setState({ transportMethod: evt.target.value });
  };

  handleChangeForMaxTime = (evt: any) => {
    this.setState({ maxTime: evt.target.value });
  };

  handleCollapseToggle = () => {
    this.setState(({ showRouteOptions }) => ({ showRouteOptions: !showRouteOptions }));
  };

  private handleSubmitSmartRoute = () => {
    this.props.onSubmit({
      searchFor: [
        ...(this.state.isCheckedForTestingKits ? ['testingKits'] : []),
        ...(this.state.isCheckedForInPerson ? ['inPersonTest'] : []),
      ],
      transportMethod: this.state.transportMethod,
      maxTime: this.state.maxTime, // min
    });
    this.props.toggle();
  };
}
