import { Toast } from 'jimu-ui';
import { React } from 'jimu-core';


export default class ToastMessage extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {

        };
      }


    render() {
        return (
            <Toast 
            type="INFO" 
            open={!!this.props.toastText} 
            text={this.props.toastText}>
            </Toast>
        )
    }


}