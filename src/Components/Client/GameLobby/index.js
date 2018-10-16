import React, { Component, Fragment } from 'react';
import MainMenuUI from './MainMenuUI';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import WalletDisplay from './WalletDisplay';
import LobbyBackgroundSlider from './LobbyBackgroundSlider';
import StageSelectUI from './StageSelectUI';
import ColosseumUI from './ColosseumUI';
import ForgeUI from './ForgeUI';

const slideEasing = Easing.bezier(0.7, 0, 0.3, 1);
const slideDuration = 1200;
const UIFadeInDuration = 400;
const UIFadeOutDuration = 200;

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
        this.slideMainMenu({ toValue: 0 });
        setTimeout(() => this.UIOn(this.state.mainMenuUIOffset, 'mainmenu'), 2000);
    }

    goToStageSelect = () => {
        this.UIOff(this.state.mainMenuUIOffset);
        this.slideMainMenu({ toValue: 1 });
        this.slideStageSelect({ toValue: 0 });
        setTimeout(() => this.UIOn(this.state.stageSelectUIOffset, 'stageselect'), slideDuration - 200);
    }

    goToColosseum = () => {
        this.UIOff(this.state.mainMenuUIOffset);
        this.slideMainMenu({ toValue: 1 });
        this.slideColosseum({ toValue: 0 });
        setTimeout(() => this.UIOn(this.state.colosseumUIOffset, 'colosseum'), slideDuration - 200);
    }

    goToForge = () => {
        this.UIOff(this.state.mainMenuUIOffset);
        this.slideMainMenu({ toValue: -1 });
        this.slideForge({ toValue: 0 });
        setTimeout(() => this.UIOn(this.state.forgeUIOffset, 'forge'), slideDuration - 200);
    }
    
    backToMainMenu = () => {
        switch(this.state.currentUI) {
            case 'forge':
                this.UIOff(this.state.forgeUIOffset);
                this.slideForge({ toValue: 1 });
                break;
            case 'stageselect':
                this.UIOff(this.state.stageSelectUIOffset);
                this.slideStageSelect({ toValue: -1 });
                break;
            case 'colosseum':
                this.UIOff(this.state.colosseumUIOffset);
                this.slideColosseum({ toValue: -1 });
                break;
            default: break;
        }
        this.slideMainMenu({ toValue: 0 });
        setTimeout(() => this.UIOn(this.state.mainMenuUIOffset, 'mainmenu'), slideDuration - 200);
    }

    slideMainMenu = option => Animated.timing(this.state.mainMenuBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();

    slideStageSelect = option => Animated.timing(this.state.stageSelectBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();
    
    slideColosseum = option => Animated.timing(this.state.colosseumBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();

    slideForge = option => Animated.timing(this.state.forgeBGOffset, { ...option, duration: slideDuration, easing: slideEasing }).start();

    UIOn = (offset, name) => {
        this.setState({ currentUI: name });
        Animated.timing(offset, { toValue: 1, duration: UIFadeInDuration }).start();
    }

    UIOff = (offset) => {
        Animated.timing(offset, { toValue: 0, duration: UIFadeOutDuration }).start();
        setTimeout(()=>this.setState({ currentUI: null }), UIFadeOutDuration);
    }
    
    render() {

        return (
            <Fragment>
                <LobbyBackgroundSlider
                    mainMenuOffset={this.state.mainMenuBGOffset}
                    colosseumOffset={this.state.colosseumBGOffset}
                    stageSelectOffset={this.state.stageSelectBGOffset}
                    forgeOffset={this.state.forgeBGOffset}
                    width={this.props.contentWidth}
                    height={this.props.contentHeight} />
                {this.state.currentUI==='mainmenu'
                    ? <MainMenuUI
                        offset={this.state.mainMenuUIOffset}
                        onGoButtonClick={this.goToStageSelect}
                        onStatueClick={this.goToForge}
                        onColosseumButtonClick={this.goToColosseum}
                        {...this.props} />
                    : null}
                {this.state.currentUI==='forge'
                    ? <ForgeUI
                        offset={this.state.forgeUIOffset}
                        onBackButtonClick={this.backToMainMenu}
                        {...this.props} />
                    : null}
                {this.state.currentUI==='stageselect'
                    ? <StageSelectUI
                        offset={this.state.stageSelectUIOffset}
                        onBackButtonClick={this.backToMainMenu}
                        {...this.props} />
                    : null}
                {this.state.currentUI==='colosseum'
                    ? <ColosseumUI
                        offset={this.state.colosseumUIOffset}
                        onBackButtonClick={this.backToMainMenu}
                        {...this.props} />
                    : null}
                <WalletDisplay width={300} height={200} x={this.props.width-300} y={20} />
            </Fragment>
        );
    }
}

export default GameLobby;