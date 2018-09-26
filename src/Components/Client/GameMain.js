import React, { Component, Fragment } from 'react';
import GameLobby from './GameLobby';
import GameBattle from './GameBattle';

class GameMain extends Component {

    state = {
        onBattle: false
    }

    render() {
        return (
            <Fragment >
                <GameLobby width={this.props.width} height={this.props.height} />
                {this.state.onBattle ? <GameBattle /> : null }
            </Fragment>
        );
    }
}

export default GameMain;