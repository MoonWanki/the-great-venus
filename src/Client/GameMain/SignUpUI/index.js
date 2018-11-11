import React, { Component } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Statue from 'Client/Components/Statue';
import Animated from 'animated';
import LookSelector from './LookSelector';
import Easing from 'animated/lib/Easing';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';
import { Container } from 'react-pixi-fiber';
import * as TGVApi from 'utils/TGVApi';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedLookSelector = Animated.createAnimatedComponent(LookSelector);
const AnimatedStatue = Animated.createAnimatedComponent(Statue);
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const easing = Easing.bezier(0, 0.8, 0.3, 1);

class SignUpUI extends Component {

    state = {
        lookSelectorOn: false,
        lookSelectorOffset: new Animated.Value(1),
        nameSetterOn: false,
        name: '',
        statueSkin: 0,
        statueEye: 0,
        statueHair: 0,
        isCreatingUser: false,
    }

    onLookChanged = (type, n) => {
        switch(type) {
            case 'skin':
                this.setState({ statueSkin: n });
                break;
            case 'eye':
                this.setState({ statueEye: n });
                break;
            case 'hair':
                this.setState({ statueHair: n });
                break;
            default: break;
        }
    }

    showCustomizer = () => {
        Animated.timing(this.state.lookSelectorOffset, { toValue: 1, easing: easing }).start();
        this.props.AppActions.closeNicknameInput();
    }

    onFinishCustomizing = () => {
        Animated.timing(this.state.lookSelectorOffset, { toValue: 0, easing: easing }).start();
        this.props.AppActions.openNicknameInput();
    }

    signUp = async () => {
        const { nicknameInputValue } = this.props;
        if(nicknameInputValue.length === 0) {
            window.Materialize.toast("이름을 정해주세요!", 1500);
            return;
        }
        try {
            this.setState({ isCreatingUser: true });
            this.props.AppActions.closeNicknameInput();
            this.props.AppActions.setPreloader(true);
            await this.props.TGV.createUser(nicknameInputValue, [this.state.statueSkin, this.state.statueHair, this.state.statueEye], { from: this.props.web3.eth.coinbase });
            let userData;
            while(true) {
                userData = await TGVApi.getUserData(this.props.TGV, this.props.web3.eth.coinbase);
                if(userData.level > 0) {
                    this.props.UserActions.syncFetchUserData(userData);
                    break;
                }
            }
            this.props.onFinish();
        } catch(err) {
            console.error(err);
            this.props.AppActions.openNicknameInput();
        } finally {
            this.setState({ isCreatingUser: false });
            this.props.AppActions.setPreloader(false);
        }
    }
    
    render() {
        const { offset, width, height } = this.props;
        const boxSize = { w: width*2/5, h: height*3/5 };
        return (
            <AnimatedContainer width={width} height={height} alpha={offset}>
                <AnimatedLookSelector
                    offset={this.state.lookSelectorOffset}
                    x={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [width, width/2] })}
                    y={height/8}
                    width={boxSize.w}
                    height={boxSize.h}
                    onChange={this.onLookChanged} />
                <AnimatedStatue
                    x={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [width/2, width/4] })}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height*4/7, height*2/3] })}
                    no={0}
                    scale={1.4}
                    eye={this.state.statueEye}
                    hair={this.state.statueHair} />
                {!this.state.isCreatingUser && <AnimatedFlatButton
                    x={-this.props.contentX + 100}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY - 86, height + this.props.contentY] })}
                    alpha={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })}
                    width={180}
                    height={36}
                    text={'BACK'}
                    onClick={this.showCustomizer} />}
                <AnimatedFlatButton
                    x={width + this.props.contentX - 280}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY, height + this.props.contentY - 86] })}
                    alpha={this.state.lookSelectorOffset}
                    width={180}
                    height={36}
                    text={'DONE'}
                    onClick={this.onFinishCustomizing} />
                <AnimatedFlatButton
                    x={width/2 - 100}
                    y={height*2/3}
                    alpha={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })}
                    width={200}
                    height={70}
                    text={this.state.isCreatingUser ? 'PROCESSING...' : 'SIGN UP'}
                    onClick={this.state.isCreatingUser ? null : this.signUp} />
            </AnimatedContainer>
        );
    }
}

export default connect(
    state => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        nicknameInputValue: state.appModule.nicknameInputValue,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
    dispatch => ({
        AppActions: bindActionCreators(appActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
    }),
)(SignUpUI);