import { React } from 'jimu-core';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'jimu-ui'

export default class TestSelect extends React.Component {

    render() {
        return (
            <Dropdown >
                <DropdownToggle caret>
                    Select Test Type
                </DropdownToggle>
                <DropdownMenu container="body">
                    <DropdownItem >
                        Immediate
                    </DropdownItem>
                    <DropdownItem >
                        Scheduled
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
        
    }
}