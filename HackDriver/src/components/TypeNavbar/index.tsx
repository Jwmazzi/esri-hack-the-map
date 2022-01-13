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
          const isActive = value === this.props.currentType;
          return (
            <Col>
              <NavItem active={isActive}>
                <div
                  style={{
                    boxShadow: isActive ? '0 1px 0px 0px #0079C1' : undefined,
                    opacity: isActive ? 'initial' : 0.7,
                    height: '40px',
                    display: 'inline-block',
                    lineHeight: '40px',
                  }}
                >
                  <NavLink
                    onClick={() => {
                      this.props.onClick(value);
                    }}
                  >
                    {value}
                  </NavLink>
                </div>
              </NavItem>
            </Col>
          );
        })}
      </Nav>
    );
  }
}
