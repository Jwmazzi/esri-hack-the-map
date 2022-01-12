import { React } from 'jimu-core';
import { Navbar, Nav, NavLink, NavItem, Button, Row, Col } from 'jimu-ui'

export default class TypeNavbar extends React.Component {

    constructor (props) {
        super(props)
    
        this.state = {
          activeLink: 0
        }
      }

    render() {
        return (
            <Nav className="me-auto" navbar
            >
                <Col>
                    <NavLink active={this.state.activeLink === 0} onClick={() => {this.props.onClick("In-Person Testing"); this.setState({activeLink: 0})}}>
                        In-Person Testing
                    </NavLink>
                </Col>
                <Col>
                    <NavLink active={this.state.activeLink === 1}onClick={() => {this.props.onClick("Testing Kits"); this.setState({activeLink: 1})}}>
                        Testing Kits
                    </NavLink>
                </Col>
            </Nav>
        )
    }
}