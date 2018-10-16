import React, { Component, Fragment } from 'react';
import GameLobby from './GameLobby';
import GameBattle from './GameBattle';

class GameBase extends Component {

    state = {
        onBattle: false
    }

    render() {
        return (
            <Fragment >
                <GameLobby {...this.props} />
                {this.state.onBattle ? <GameBattle /> : null }
            </Fragment>
        );
    }
}

export default GameBase;