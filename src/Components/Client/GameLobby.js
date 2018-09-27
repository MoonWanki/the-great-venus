import React, { Component, Fragment } from 'react';
import GameBackground from './GameBackground';
import GameMainMenuBoard from './GameMainMenuBoard';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import GameStageSelectBoard from './GameStageSelectBoard';
import GameCoinStatusBar from './GameCoinStatusBar';

class GameLobby extends Component {

    state = {
        stageSelectOn: false,
        mainMenuOffset: new Animated.Value(0)
    }

    componentDidMount() {
        Animated.timing(this.state.mainMenuOffset, { toValue: 1, delay: 1800, duration: 2000, easing: Easing.bezier(0.1, 0.8, 0.3, 1) }).start();
    }

    goToStageSelect = () => {
        Animated.timing(this.state.mainMenuOffset, { toValue: 0, duration: 2000, easing: Easing.bezier(0.1, 0.8, 0.3, 1) }).start();
    }
    
    goToMainMenu = () => {
        Animated.timing(this.state.mainMenuOffset, { toValue: 1, delay: 1800, duration: 2000, easing: Easing.bezier(0.1, 0.8, 0.3, 1) }).start();
    }

    render() {
        return (
            <Fragment>
                <GameBackground
                    theme={0}
                    width={this.props.width}
                    height={this.props.height} />
                <GameMainMenuBoard
                    offset={this.state.mainMenuOffset}
                    width={this.props.width}
                    height={this.props.height} />
                <GameStageSelectBoard />
                <GameCoinStatusBar />
            </Fragment>
        );
    }
}

export default GameLobby;