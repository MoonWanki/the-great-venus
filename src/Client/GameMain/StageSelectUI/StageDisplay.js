import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';
import Animated from 'animated';
import Field from 'Client/Components/Field';
import { connect } from 'react-redux';
import Background from 'Client/Components/Background';
import Easing from 'animated/lib/Easing';
import Modal from 'Client/Components/Modal';
import * as userActions from 'store/modules/userModule';
import { bindActionCreators } from 'redux';

const loadingScreenFadeDuration = 1000;
const fieldBGSlideDuration = 1500;
const fieldBGSlideEasing = Easing.bezier(0.6, 0, 0.2, 1);
const fieldFadeDuration = 200;

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);
const AnimatedField = Animated.createAnimatedComponent(Field);

class StageDisplay extends Component {

    state = {
        loadingScreenOffset: new Animated.Value(1),
        fieldBGOn: false,
        fieldBGOffset: [new Animated.Value(0), new Animated.Value(1)],
        fieldOffset: new Animated.Value(0),
        fieldOn: false,
        currentRound: 0,
        roundVictoryModalOn: false,
        roundDefeatedModalOn: false,
        stageResultModalOn: false,
    }

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    componentDidMount = async () => {
        this.toNextRound();
        await this.sleep(1000);
        this.setState({ fieldBGOn: true });
        this.dismissLoadingScreen();
    }

    slideFieldBG = async () => {
        Animated.timing(this.state.fieldBGOffset[0], { toValue: -1, duration: fieldBGSlideDuration, easing: fieldBGSlideEasing }).start();
        Animated.timing(this.state.fieldBGOffset[1], { toValue: 0, duration: fieldBGSlideDuration, easing: fieldBGSlideEasing }).start();
        await this.sleep(fieldBGSlideDuration);
        this.setState({ fieldBGOffset: [new Animated.Value(0), new Animated.Value(1)] });
    }

    dismissLoadingScreen = () => {
        Animated.timing(this.state.loadingScreenOffset, { toValue: 0, duration: loadingScreenFadeDuration }).start();
    }

    onFinishRound = () => {
        if(this.props.stageResult.roundResultList[this.state.currentRound - 1].victory) {
            this.applyRoundResult();
            this.setState({ roundVictoryModalOn: true });
        } else {
            this.setState({ roundDefeatedModalOn: true });
        }
    }

    toNextRound = async () => {
        if(this.state.currentRound < this.props.stageResult.roundResultList.length) {
            this.turnFieldOff();
            await this.sleep(fieldFadeDuration);
            this.slideFieldBG();
            this.setState({ currentRound: this.state.currentRound + 1 });
            await this.sleep(fieldBGSlideDuration);
            this.turnFieldOn();
        } else {
            this.setState({ stageResultModalOn: true });
        }
    }

    applyRoundResult = () => {
        const { sorbiote, exp, preRequiredExp, requiredExp, level } = this.props.userData;
        const roundExp = this.props.stageResult.roundResultList[this.state.currentRound - 1].exp;
        const roundSorbiote = this.props.stageResult.roundResultList[this.state.currentRound - 1].sorbiote;
        const isLevelUp = exp + roundExp >= requiredExp[0];
        this.props.UserActions.syncFetchUserData({
            ...this.props.userData,
            level: isLevelUp ? level + 1 : level,
            preRequiredExp: isLevelUp ? requiredExp[0] : preRequiredExp,
            requiredExp: isLevelUp ? [requiredExp[1], requiredExp[1]] : requiredExp,
            exp: exp + roundExp,
            sorbiote: sorbiote + roundSorbiote
        });
    }

    turnFieldOn = () => {
        this.setState({ fieldOn: true });
        Animated.timing(this.state.fieldOffset, { toValue: 1, duration: fieldFadeDuration }).start();
    }

    turnFieldOff = async () => {
        Animated.timing(this.state.fieldOffset, { toValue: 0, duration: fieldFadeDuration }).start();
        await this.sleep(fieldFadeDuration);
        this.setState({ fieldOn: false });
    }

    render() {
        const { width, height } = this.props;
        const roundResult = this.props.stageResult.roundResultList[this.state.currentRound - 1];
        return (
            <Container alpha={this.props.offset} width={width} height={height}>
                {this.state.fieldBGOn && <Background
                    theme={`stage_field1_1`}
                    width={width}
                    height={height}
                    offsetX={this.state.fieldBGOffset[0]}
                    offsetY={0} />}
                {this.state.fieldBGOn && <Background
                    theme={`stage_field1_1`}
                    width={width}
                    height={height}
                    offsetX={this.state.fieldBGOffset[1]}
                    offsetY={0} />}
                {this.state.fieldOn && <AnimatedField
                    width={width}
                    height={height}
                    offset={this.state.fieldOffset}
                    data={roundResult}
                    onFinish={this.onFinishRound} />}
                {this.state.roundVictoryModalOn && <Modal
                    text={`${this.state.currentRound}라운드 클리어!\n\n소비오트 ${roundResult.sorbiote}개를 얻었습니다.\n경험치를 ${roundResult.exp} 얻었습니다.`}
                    width={500}
                    height={300}
                    buttonText={'다음'}
                    offset={1}
                    onDismiss={() => {
                        this.setState({ roundVictoryModalOn: false });
                        this.toNextRound();
                    }} />}
                {this.state.roundDefeatedModalOn && <Modal
                    text={`패배하였습니다.`}
                    width={500}
                    height={300}
                    buttonText={'돌아가기'}
                    offset={1}
                    onDismiss={() => {
                        this.setState({ roundDefeatedModalOn: false });
                        this.props.onFinish();
                    }} />}
                {this.state.stageResultModalOn && <Modal
                    text={`${this.props.stageResult.stageNo} 스테이지 클리어!`}
                    width={500}
                    height={300}
                    buttonText={'확인'}
                    offset={1}
                    onDismiss={() => {
                        this.setState({ stageResultModalOn: false });
                        this.props.onFinish();
                    }} />}
                <AnimatedSprite
                    width={width}
                    height={height}
                    alpha={this.state.loadingScreenOffset}
                    texture={this.context.app.loader.resources.stage_field_loading_screen.texture} />
            </Container>
        );
    }
}

StageDisplay.contextTypes = {
    app: PropTypes.object,
};

export default connect(
    state => ({
        TGV: state.web3Module.TGV,
        userData: state.userModule.userData,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
    })
)(StageDisplay);