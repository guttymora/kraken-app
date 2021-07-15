import React from 'react';
import './window-content.styles.sass';

class WindowContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={'window-content'}>
                {this.props.children}
            </div>
        )
    }
}

export default WindowContent;
