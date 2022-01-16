/** @jsx jsx */
import Graphic from 'esri/Graphic';
import FeatureLayer from 'esri/layers/FeatureLayer';
import { React, jsx } from 'jimu-core';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Form, FormGroup, Input, Label, TextInput } from 'jimu-ui';
import { IMConfig } from '../../config';

interface Props {
  toggle: () => void;
  isOpen: boolean;
  onSubmit: (info: { searchFor: string[]; transportMethod: 'walking' | 'driving'; maxTime: number }) => void;
  config: IMConfig;
}

interface State {
  // TODO:
}

export default class RespondModal extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.feedbackFL = new FeatureLayer({ url: this.props.config.feedbackURL });

    this.state = {
      checked: false,
    };
  }

  submitResponse = (evt) => {
    evt.preventDefault();

    var testResp = Array.from(document.querySelectorAll('[data-tk]')).filter((e) => e.checked);
    if (testResp.length > 0) {
      testResp = testResp[0].defaultValue;
    } else {
      testResp = 'N/A';
    }

    var walkResp = Array.from(document.querySelectorAll('[data-wk]')).filter((e) => e.checked);
    if (walkResp.length > 0) {
      walkResp = walkResp[0].defaultValue;
    } else {
      walkResp = 'N/A';
    }

    const respGraphic = new Graphic({
      attributes: {
        SiteID: this.props.siteFeature.attributes.SiteID,
        TK_Answer: testResp,
        WK_Answer: walkResp,
        Comments: document.getElementById('userComment').value,
      },
    });

    this.feedbackFL.applyEdits({
      addFeatures: [respGraphic],
    });

    this.props.toggle();
  };

  render() {
    return (
      <Modal toggle={this.props.toggle} isOpen={this.props.isOpen} centered>
        <ModalHeader toggle={this.props.toggle}>Comment on Current Facility Status</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup tag="fieldset">
              <legend>Test Kit Availability</legend>
              <FormGroup check>
                <Input data-tk value="yes" name="radio1" type="radio" /> <Label check>There was plent of stock.</Label>
              </FormGroup>
              <FormGroup check>
                <Input data-tk value="no" name="radio1" type="radio" /> <Label check>Inventory is running low.</Label>
              </FormGroup>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>Walk-in Availability</legend>
              <FormGroup check>
                <Input data-wk value="yes" name="radio2" type="radio" />{' '}
                <Label check>I was seen without an appointment.</Label>
              </FormGroup>
              <FormGroup check>
                <Input data-wk value="no" name="radio2" type="radio" />{' '}
                <Label check>Wait times are too long at this location.</Label>
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label for="userComment">Comments</Label>
              <TextInput id="userComment" name="userComment" placeholder="General observations . . ." />
            </FormGroup>
            <Button block type="primary" onClick={this.submitResponse}>
              Submit Response
            </Button>
          </Form>
        </ModalBody>
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
