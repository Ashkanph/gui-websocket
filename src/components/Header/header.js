import React, {Component} from 'react';

import {
    Button
  } from "semantic-ui-react";


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility: false
        }
    }

    render() {
        let themText = this.props.theme === 'dark' ? 'light' : 'dark';

        return (
            <div>
                <header className="header">
                    <span className="title" style={{ float: 'left', color: '#1F2931' }}>
                        GUI Websocket
                    </span>
                    <span   className = { 'theme-btn ' + themText } 
                            onClick={this.props.changeTheme}>
                            { themText }
                    </span>
                </header>
            </div>
        )
    }
}

export default Header;
