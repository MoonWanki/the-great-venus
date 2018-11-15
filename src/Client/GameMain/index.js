import React, { Component, Fragment } from 'react';
import HomeUI from './HomeUI';
import Animated from 'animated';
import PropTypes from 'prop-types';
import Easing from 'animated/lib/Easing';
import LobbyBackgroundSlider from './LobbyBackgroundSlider';
import LobbyUI from './LobbyUI';
import SettingUI from './SettingUI';
import ShowroomUI from './ShowroomUI';
import ForgeUI from './ForgeUI';
import StageSelectUI from './StageSelectUI';
import ColosseumUI from './ColosseumUI';
import { connect } from 'react-redux';
import SignUpUI from './SignUpUI';
import { Sprite } from 'react-pixi-fiber';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';

const slideDuration = 1500;
const skySlideDuration = 15000;
const skySlideEasing = Easing.bezier(0.3, 1, 0.6, 1);
const slideEasing = Easing.bezier(0.6, 0, 0.2, 1);
const UIFadeInDuration = 800;
const UIFadeOutDuration = 400;
const UIFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);

class GameMain extends Component {

    state = {
        skyOffset: new Animated.Value(0),
        lobbyUIOn: false,
        lobbyUIOffset: new Animated.Value(0),
        settingUIOn: false,
        settingUIOffset: new Animated.Value(0),
        currentUI: null,
        homeBGOffset: new Animated.Value(0.95),
        homeUIOffset: new Animated.Value(0),
        showroomBGOffset: new Animated.Value(1),
        showroomUIOffset: new Animated.Value(0),
        forgeBGOffset: new Animated.Value(1),
        forgeUIOffset: new Animated.Value(0),
        stageSelectBGOffset: new Animated.Value(-1),
        stageSelectUIOffset: new Animated.Value(0),
        colosseumBGOffset: new Animated.Value(-1),
        colosseumUIOffset: new Animated.Value(0),
        signUpUIOffset: new Animated.Value(0),
        currentSelectedStatue: 0,
        introCreditOffset: new Animated.Value(0),
        introCreditTexture: null,
        introCreditStep: 0,
    }

    componentDidMount() {
        alert('오픈 베타 버전입니다!\n기본적인 컨텐츠 이용 테스트가 가능하며, 이를 위해 임시 GUI 환경으로 제공되는 점 양해바랍니다.');
        window.onkeydown = this.onKeydownOnIntro;
        setTimeout(this.showNextIntroCredit, 1000);
        this.slideSkyBG({ toValue: -1, duration: skySlideDuration, easing: skySlideEasing });
        this.slideHomeBG({ toValue: 0, duration: skySlideDuration, easing: skySlideEasing });
    }

    onKeydownOnIntro = (e) => {
        if(e.keyCode === 27) {
            this.showNextIntroCredit();
        }
    }

    showNextIntroCredit = () => {
        if(this.state.introCreditStep === 0) {
            this.setState({
                introCreditTexture: this.context.app.loader.resources.intro_credit1,
                introCreditStep: 1,
            });
            Animated.timing(this.state.introCreditOffset, { toValue: 1, duration: 1000 }).start();
            setTimeout(()=>{
                Animated.timing(this.state.introCreditOffset, { toValue: 0, duration: 400 }).start();
                setTimeout(this.showNextIntroCredit, 400);
            }, 2500);
        } else if(this.state.introCreditStep === 1) {
            this.setState({
                introCreditOffset: new Animated.Value(0),
                introCreditTexture: this.context.app.loader.resources.intro_credit2,
                introCreditStep: 2,
            });
            Animated.timing(this.state.introCreditOffset, { toValue: 1, duration: 1000 }).start();
            setTimeout(()=>{
                Animated.timing(this.state.introCreditOffset, { toValue: 0, duration: 400 }).start();
                setTimeout(this.showNextIntroCredit, 400);
            }, 2500);
        } else if(this.state.introCreditStep === 2) {
            window.onkeydown = null;
            this.setState({
                introCreditOffset: new Animated.Value(0),
                introCreditStep: -1,
            });
            setTimeout(()=>{
                if(this.props.userData.level) {
                    this.turnOnLobbyUI();
                    this.turnOnInnerUI(this.state.homeUIOffset, 'home');
                } else {
                    this.turnOnInnerUI(this.state.signUpUIOffset, 'signup');
                }
            }, 1500);
        }
    }

    onFinishSignup = async () => {
        this.turnOffInnerUI(this.state.signUpUIOffset);
        this.slideSkyBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
        this.slideHomeBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
        this.turnOnLobbyUI();
        this.slideShowroomBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.showroomUIOffset, 'showroom'), slideDuration - 400);
    }


    goToShowroom = () => {
        switch(this.state.currentUI) {
            case 'home':
            this.turnOffInnerUI(this.state.homeUIOffset);
            this.slideHomeBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
            break;
            case 'forge':
            this.turnOffInnerUI(this.state.forgeUIOffset);
            this.slideForgeBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
            break;
            case 'stageselect':
            this.turnOffInnerUI(this.state.stageSelectUIOffset);
            this.slideStageSelectBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
            break;
            case 'colosseum':
            this.turnOffInnerUI(this.state.colosseumUIOffset);
            this.setState({ homeBGOffset: new Animated.Value(-1) });
            this.slideColosseumBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
            break;
            default: break;
        }
        this.slideShowroomBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.showroomUIOffset, 'showroom'), slideDuration - 400);
    }

    goToForge = () => {
        this.turnOffInnerUI(this.state.showroomUIOffset);
        this.slideShowroomBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
        this.slideForgeBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.forgeUIOffset, 'forge'), slideDuration - 400);
    }
    
    goToStageSelect = () => {
        this.turnOffInnerUI(this.state.showroomUIOffset);
        this.slideShowroomBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
        this.slideStageSelectBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.stageSelectUIOffset, 'stageselect'), slideDuration - 400);
    }

    goToColosseum = () => {
        switch(this.state.currentUI) {
            case 'home':
                this.turnOffInnerUI(this.state.homeUIOffset);
                this.slideHomeBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
                break;
            case 'showroom':
                this.turnOffInnerUI(this.state.showroomUIOffset);
                this.slideShowroomBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
                break;
            default: break;
        }
        this.slideColosseumBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.colosseumUIOffset, 'colosseum'), slideDuration - 400);
    }

    goToHome = () => {
        switch(this.state.currentUI) {
            case 'showroom':
                this.turnOffInnerUI(this.state.showroomUIOffset);
                this.slideShowroomBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
                break;
            case 'forge':
                this.turnOffInnerUI(this.state.forgeUIOffset);
                this.slideForgeBG({ toValue: 1, duration: slideDuration, easing: slideEasing });
                break;
            case 'stageselect':
                this.turnOffInnerUI(this.state.stageSelectUIOffset);
                this.slideStageSelectBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
                break;
            case 'colosseum':
                this.turnOffInnerUI(this.state.colosseumUIOffset);
                this.slideColosseumBG({ toValue: -1, duration: slideDuration, easing: slideEasing });
                break;
            default: break;
        }
        this.slideHomeBG({ toValue: 0, duration: slideDuration, easing: slideEasing });
        setTimeout(() => this.turnOnInnerUI(this.state.homeUIOffset, 'home'), slideDuration - 400);
    }

    slideSkyBG = option => Animated.timing(this.state.skyOffset, option).start();

    slideHomeBG = option => Animated.timing(this.state.homeBGOffset, option).start();

    slideShowroomBG = option => Animated.timing(this.state.showroomBGOffset, option).start();
    
    slideForgeBG = option => Animated.timing(this.state.forgeBGOffset, option).start();
    
    slideStageSelectBG = option => Animated.timing(this.state.stageSelectBGOffset, option).start();
    
    slideColosseumBG = option => Animated.timing(this.state.colosseumBGOffset, option).start();

    turnOnLobbyUI = () => {
        this.setState({ lobbyUIOn: true });
        Animated.timing(this.state.lobbyUIOffset, { toValue: 1, duration: UIFadeInDuration, easing: UIFadeEasing }).start();
    }

    turnOffLobbyUI = () => {
        Animated.timing(this.state.lobbyUIOffset, { toValue: 0, duration: UIFadeOutDuration, easing: UIFadeEasing }).start();
        setTimeout(()=>this.setState({ lobbyUIOn: false }), UIFadeOutDuration);
    }
    
    turnOnSettingUI = () => {
        this.setState({ settingUIOn: true });
        Animated.timing(this.state.settingUIOffset, { toValue: 1, duration: UIFadeInDuration, easing: UIFadeEasing }).start();
    }

    turnOffSettingUI = () => {
        Animated.timing(this.state.settingUIOffset, { toValue: 0, duration: UIFadeOutDuration, easing: UIFadeEasing }).start();
        setTimeout(()=>this.setState({ settingUIOn: false }), UIFadeOutDuration);
    }

    turnOnInnerUI = (offset, name) => {
        this.setState({ currentUI: name });
        Animated.timing(offset, { toValue: 1, duration: UIFadeInDuration, easing: UIFadeEasing }).start();
    }

    turnOffInnerUI = (offset) => {
        Animated.timing(offset, { toValue: 0, duration: UIFadeOutDuration, easing: UIFadeEasing }).start();
        setTimeout(()=>this.setState({ currentUI: null }), UIFadeOutDuration);
    }

    onClickStatue = (no) => this.setState({ currentSelectedStatue: no });

    renderInnerUI = () => {
        switch(this.state.currentUI) {
            case 'home':
                return <HomeUI
                    offset={this.state.homeUIOffset}
                    onStatueClick={this.goToForge}
                    onShowroomButtonClick={this.goToShowroom}
                    onColosseumButtonClick={this.goToColosseum}
                    {...this.props} />
            case 'showroom':
                return <ShowroomUI
                    offset={this.state.showroomUIOffset}
                    backgroundOffset={this.state.showroomBGOffset}
                    onHomeButtonClick={this.goToHome}
                    onForgeButtonClick={this.goToForge}
                    onStageSelectButtonClick={this.goToStageSelect}
                    onColosseumButtonClick={this.goToColosseum}
                    currentSelectedStatue={this.state.currentSelectedStatue}
                    onClickStatue={this.onClickStatue}
                    {...this.props} />
            case 'forge':
                return <ForgeUI
                    offset={this.state.forgeUIOffset}
                    onBackButtonClick={this.goToShowroom}
                    currentSelectedStatue={this.state.currentSelectedStatue}
                    onClickStatue={this.onClickStatue}
                    {...this.props} />
            case 'stageselect':
                return <StageSelectUI
                    offset={this.state.stageSelectUIOffset}
                    onBackButtonClick={this.goToShowroom}
                    {...this.props} />
            case 'colosseum':
                return <ColosseumUI
                    offset={this.state.colosseumUIOffset}
                    onBackButtonClick={this.goToShowroom}
                    {...this.props} />
            case 'signup':
                return <SignUpUI
                    offset={this.state.signUpUIOffset}
                    onFinish={this.onFinishSignup}
                    {...this.props} />
            default:
                return null;
        }
    }
    
    render() {
        return (
            <Fragment>
                <LobbyBackgroundSlider
                    skyOffset={this.state.skyOffset}
                    homeOffset={this.state.homeBGOffset}
                    showroomOffset={this.state.showroomBGOffset}
                    colosseumOffset={this.state.colosseumBGOffset}
                    stageSelectOffset={this.state.stageSelectBGOffset}
                    forgeOffset={this.state.forgeBGOffset}
                    {...this.props} />
                {this.state.introCreditStep > 0 && <AnimatedSprite
                    interactive
                    click={this.showNextIntroCredit}
                    texture={this.state.introCreditTexture.texture}
                    alpha={this.state.introCreditOffset}
                    x={this.props.width/2}
                    y={this.props.height/2}
                    anchor={[0.5, 0.5]} />
                }
                {this.renderInnerUI()}
                {this.state.lobbyUIOn && <LobbyUI
                    offset={this.state.lobbyUIOffset}
                    {...this.props} />}
                <Sprite
                    interactive
                    cursor="pointer"
                    x={this.props.width + this.props.contentX - 20}
                    y={-this.props.contentY + 20}
                    anchor={[1, 0]}
                    texture={this.context.app.loader.resources.btn_setting.texture}
                    click={this.turnOnSettingUI} />
                {this.state.settingUIOn && <SettingUI
                    offset={this.state.settingUIOffset}
                    onDismiss={this.turnOffSettingUI}
                    {...this.props} />
                }
            </Fragment>
        );
    }
}

GameMain.contextTypes = {
    app: PropTypes.object,
};

export default connect(
    state => ({
        userData: state.userModule.userData,
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    }),
)(GameMain);