/** @jsx jsx */
import { React, AllWidgetProps, jsx, appActions } from 'jimu-core';
import { IMConfig } from '../config';

import { Container} from 'jimu-ui';

import TestSelect from '../components/TestSelect';
import TypeNavbar from '../components/TypeNavbar';
import { timeStamp } from 'console';

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor (props) {
    super(props)

    this.state = {
      activeType: null
    }
  }

  onClick = (activeType) => {

    this.setState({
      activeType,
    });

    this.props.dispatch(
      appActions.widgetStatePropChange('hack', 'activeType', activeType)
    );
  }

  render() {
    return (
      <Container>
              <TypeNavbar onClick={this.onClick}/>
      </Container>
      // <TestSelect onClick={this.onClick} />
    )
  }
}
