import { React } from 'jimu-core';
import { Navbar, Nav, NavLink, NavItem, Button, Row, Col } from 'jimu-ui';

interface Props {
  allTypes: string[];
  onClick: (value: string) => void;
  currentType: string;
}

export default class TypeNavbar extends React.Component<Props> {
  render() {
    return (
      <Nav className="me-auto" navbar>
        {this.props.allTypes.map((value) => {
          console.log(value, value === this.props.currentType);
          return (
            <Col>
              <NavLink
                active={value === this.props.currentType}
                onClick={() => {
                  this.props.onClick(value);
                }}
              >
                {value}
              </NavLink>
            </Col>
          );
        })}
      </Nav>
    );
  }
}
