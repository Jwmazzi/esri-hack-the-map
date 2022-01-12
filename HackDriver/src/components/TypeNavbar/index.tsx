import { React } from 'jimu-core';
import { Navbar, Nav, NavItem, Button } from 'jimu-ui'

export default class TypeNavbar extends React.Component {

    render() {
        return (
            <Navbar
            color="light"
            expand={true}
            light
            full={true}
            >
                <Nav
                className="me-auto"
                navbar
                >
                <NavItem>
                    <Button color="primary" onClick={() => this.props.onClick("Indoor")}>
                        Indoor
                    </Button>
                </NavItem>
                <NavItem>
                    <Button color="primary" onClick={() => this.props.onClick("Outdoor")}>
                        Outdoor
                    </Button>
                </NavItem>
                </Nav>

            </Navbar>
        )
        
    }
}