import React, { Component, Fragment } from 'react';
import MainMenuUI from './MainMenuUI';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import StageSelectUI from './StageSelectUI';
import WalletDisplay from './WalletDisplay';
import LobbyBackgroundSlider from './LobbyBackgroundSlider';

const slideEasing = Easing.bezier(0.7, 0, 0.3, 1);
const slideDuration = 1200;

class GameLobby extends Component {

    state = {
        currentUI: null,
        mainMenuBGOffset: new Animated.Value(1),
        mainMenuUIOffset: new Animated.Value(0),
        forgeBGOffset: new Animated.Value(1),
        forgeUIOffset: new Animated.Value(0),
        stageSelectBGOffset: new Animated.Value(-1),
        stageSelectUIOffset: new Animated.Value(0),
        colosseumBGOffset: new Animated.Value(-1),
        colosseumUIOffset: new Animated.Value(0),
    }

    componentDidMount() {
        this.setState({ currentUI: 'mainmenu' })
        Animated.timing(this.state.mainMenuUIOffset, {
            delay: 4800,
            toValue: 1,
            duration: 2000,
            easing: Easing.bezier(0.1, 0.8, 0.3, 1),
        }).start();
        this.slideMainMenu({ toValue: 0 });
    }

    goToStageSelect = () => {
        this.slideMainMenu({ toValue: 1 });
        this.slideStageSelect({ toValue: 0 });
        this.slideColosseum({ toValue: -1 });
        this.slideForge({ toValue: 1 });
        this.setState({ currentUI: null });
        setTimeout(()=>this.setState({ currentUI: 'stageselect' }), slideDuration);
    }

    goToColosseum = () => {
        this.slideMainMenu({ toValue: 1 });
        this.slideStageSelect({ toValue: -1 });
        this.slideColosseum({ toValue: 0 });
        this.slideForge({ toValue: 1 });
        this.setState({ currentUI: null });
        setTimeout(()=>this.setState({ currentUI: 'colosseum' }), slideDuration);
    }

    goToForge = () => {
        this.slideMainMenu({ toValue: -1 });
        this.slideStageSelect({ toValue: -1 });
        this.slideColosseum({ toValue: -1 });
        this.slideForge({ toValue: 0 });
        this.setState({ currentUI: null });
        setTimeout(()=>this.setState({ currentUI: 'forge' }), slideDuration);
    }
    
    backToMainMenu = () => {
        this.slideMainMenu({ toValue: 0 });
        this.slideStageSelect({ toValue: -1 });
        this.slideColosseum({ toValue: -1 });
        this.slideForge({ toValue: 1 });
        this.setState({ currentUI: null });
        setTimeout(()=>this.setState({ currentUI: 'mainmenu' }), slideDuration);
    }

    slideMainMenu = option => Animated.timing(this.state.mainMenuBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();

    slideStageSelect = option => Animated.timing(this.state.stageSelectBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();
    
    slideColosseum = option => Animated.timing(this.state.colosseumBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();

    slideForge = option => Animated.timing(this.state.forgeBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();
    
    render() {
        return (
            <Fragment>
                <LobbyBackgroundSlider
                    mainMenuOffset={this.state.mainMenuBGOffset}
                    colosseumOffset={this.state.colosseumBGOffset}
                    stageSelectOffset={this.state.stageSelectBGOffset}
                    forgeOffset={this.state.forgeBGOffset}
                    width={this.props.width}
                    height={this.props.height} />
                {this.state.currentUI==='mainmenu'
                    ? <MainMenuUI
                        offset={this.state.mainMenuUIOffset}
                        width={this.props.width}
                        height={this.props.height}
                        onGoButtonClick={this.goToStageSelect}
                        onStatueClick={this.goToForge}
                        onColosseumButtonClick={this.goToColosseum} />
                    : null}
                {this.state.currentUI==='stageselect'
                    ? <StageSelectUI
                        offset={this.state.stageSelectUIOffset} />
                    : null}
                <WalletDisplay width={300} height={200} x={this.props.width-300} y={20} />
            </Fragment>
        );
    }
}

export default GameLobby;