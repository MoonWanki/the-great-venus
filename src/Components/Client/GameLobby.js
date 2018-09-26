import React, { Component, Fragment } from 'react';
import Background from './Background';


class GameLobby extends Component {
    render() {
        return (
            <Fragment>
                <Background
                    interactive
                    theme={0}
                    width={this.props.width}
                    height={this.props.height}
                    />
            </Fragment>
        );
    }
}



export default GameLobby;