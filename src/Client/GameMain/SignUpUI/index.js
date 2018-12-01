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
import { Container, Text } from 'react-pixi-fiber';
import * as TGVApi from 'utils/TGVApi';
import Box from 'Client/Components/Box';

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
        loadingMessage: '',
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
            this.setState({ isCreatingUser: true, loadingMessage: '캐릭터를 생성 중입니다. 잠시만 기다려주세요.' });
            this.props.AppActions.closeNicknameInput();
            this.props.AppActions.setPreloader(true);
            await this.props.TGV.createUser(nicknameInputValue, [this.state.statueSkin, this.state.statueHair, this.state.statueEye], { from: this.props.web3.eth.coinbase });
            this.setState({ loadingMessage: '데이터 동기화 중입니다. 잠시만 기다려주세요.' });
            while(true) {
                const userData = await TGVApi.getUserData(this.props.TGV, this.props.web3.eth.coinbase);
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
            this.setState({ isCreatingUser: false, loadingMessage: '' });
            this.props.AppActions.setPreloader(false);
        }
    }
    
    render() {
        const { offset, width, height } = this.props;
        return (
            <AnimatedContainer width={width} height={height} alpha={offset}>
                <AnimatedLookSelector
                    offset={this.state.lookSelectorOffset}
                    x={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [width, width*9/20] })}
                    y={height/4}
                    width={width/3}
                    height={height/2}
                    onChange={this.onLookChanged} />
                <AnimatedStatue
                    x={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [width/2, width/3] })}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height*4/7, height*2/3] })}
                    no={0}
                    scale={1.4}
                    skin={this.state.statueSkin}
                    eye={this.state.statueEye}
                    hair={this.state.statueHair} />
                {!this.state.isCreatingUser && <AnimatedFlatButton
                    x={-this.props.contentX + 150}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY - 60, height + this.props.contentY + 60] })}
                    alpha={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })}
                    text={'BACK'}
                    onClick={this.showCustomizer} />}
                <AnimatedFlatButton
                    x={width + this.props.contentX - 150}
                    y={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 60, height + this.props.contentY - 60] })}
                    alpha={this.state.lookSelectorOffset}
                    text={'DONE'}
                    onClick={this.onFinishCustomizing} />
                <AnimatedFlatButton
                    x={width/2}
                    y={height*2/3 + 30}
                    alpha={this.state.lookSelectorOffset.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })}
                    disabled={this.state.isCreatingUser}
                    text={this.state.isCreatingUser ? '처리 중입니다...' : '완료'}
                    onClick={this.state.isCreatingUser ? null : this.signUp} />
                {this.state.isCreatingUser && <Container interactive>
                    <Box width={width} height={height} alpha={0.5} />
                    <Text
                        anchor={[0.5, 0.5]}
                        text={this.state.loadingMessage}
                        x={width/2}
                        y={height/2 + 60}
                        style={{ fill: 0xffffff, fontSize: 15, align: 'center', fontFamily: 'Noto Sans KR' }} />
                </Container>}
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