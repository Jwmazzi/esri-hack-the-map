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
              <NavItem
                active={isActive}
                style={{
                  boxShadow: isActive ? '0 2px 0px 0px #0079C1' : undefined,
                  opacity: isActive ? 'initial' : 0.7,
                  display: 'inline-block',
                  height: '56px',
                  lineHeight: '56px',
                }}
              >
                <NavLink
                  onClick={() => {
                    this.props.onClick(value);
                  }}
                  style={{ padding: 0, color: '#151515', fontSize: '16px' }}
                >
                  {value}
                </NavLink>
              </NavItem>
            </Col>
          );
        })}
      </Nav>
    );
  }
}
