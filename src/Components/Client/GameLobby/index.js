import React, { Component, Fragment } from 'react';
import MainMenuBoard from './MainMenuBoard';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import StageSelectBoard from './StageSelectBoard';
import WalletStatusBar from './MainMenuBoard/WalletStatusBar';

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
                <MainMenuBoard
                    offset={this.state.mainMenuOffset}
                    width={this.props.width}
                    height={this.props.height} />
                <StageSelectBoard />
                <WalletStatusBar />
            </Fragment>
        );
    }
}

export default GameLobby;