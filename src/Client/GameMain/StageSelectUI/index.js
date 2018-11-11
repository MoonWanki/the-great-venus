import React, { Component, Fragment } from 'react';
import FlatButton from '../../Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as TGVApi from 'utils/TGVApi';
import * as appActions from 'store/modules/appModule';
import StageDisplay from './StageDisplay';
import Easing from 'animated/lib/Easing';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';

const stageDisplayFadeDuration = 500;
const stageDisplayFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStageDisplay = Animated.createAnimatedComponent(StageDisplay);

class StageSelectUI extends Component {

    state = {
        loadingScreenOn: false,
        loadingScreenMessage: '',
        stageDisplayOn: false,
        stageDisplayOffset: new Animated.Value(0),
        stageResult: null,
    }

    clearStage = async (stageNo, units) => {
        try {
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '스테이지에 입장하고 있습니다. 잠시만 기다려주세요.' });
            this.props.AppActions.setPreloader(true);
            const roundResultList = await TGVApi.clearStage(this.props.TGV, stageNo, units, this.props.web3.eth.coinbase);
            this.showStageDisplay(stageNo, roundResultList);
        } catch(err) {
            console.error(err);
        } finally {
            this.setState({ loadingScreenOn: false });
            this.props.AppActions.setPreloader(false);
        }
    }

    showStageDisplay = (stageNo, roundResultList) => {
        this.setState({
            stageResult: {
                stageNo: stageNo,
                roundResultList: roundResultList,
            },
            stageDisplayOn: true,
        });
        Animated.timing(this.state.stageDisplayOffset, { toValue: 1, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
    }

    // 끝나면 이거 호출하고 까만화면 띄우면 될듯 얘가 알아서 꺼주니까
    dismissStageDisplay = async () => {
        try {
            this.props.UserActions.fetchFinney(this.props.web3);
            this.props.AppActions.setPreloader(true);
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '데이터 동기화 중입니다. 잠시만 기다려주세요.' });
            await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
        } catch (err) {
            console.error(err);
        } finally {
            Animated.timing(this.state.stageDisplayOffset, { toValue: 0, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
            setTimeout(()=>this.setState({
                stageDisplayOn: false,
                stageResult: null,
                loadingScreenOn: false,
            }), stageDisplayFadeDuration);
            this.props.AppActions.setPreloader(false);
        }
    }

    renderStageButtons = () => _.times(this.props.gameData.maxStage, i => {
        i++;
        if(i <= this.props.userData.lastStage + 1)
            return <FlatButton key={i} x={200*i - this.props.contentX} y={400} width={100} height={100} text={i} onClick={() => this.clearStage(i, _.times(this.props.userData.numStatues))} />
        else
            return <FlatButton key={i} x={200*i - this.props.contentX} y={400} width={100} height={100} text={i +' (LOCKED)'} />
    });

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                {this.renderStageButtons()}
                <AnimatedFlatButton
                    x={-this.props.contentX + 100}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY, height + this.props.contentY - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'BACK TO SHOWROOM'}
                    onClick={this.props.onBackButtonClick} />
                {this.state.stageDisplayOn && <AnimatedStageDisplay
                    width={width}
                    height={height}
                    offset={this.state.stageDisplayOffset}
                    stageResult={this.state.stageResult}
                    onFinish={this.dismissStageDisplay} />}
                {this.state.loadingScreenOn && <Container interactive>
                    <Box width={width} height={height} alpha={0.5} />
                    <Text
                        anchor={[0.5, 0.5]}
                        text={this.state.loadingScreenMessage}
                        x={width/2}
                        y={height/2 + 60}
                        style={{ fill: 0xffffff, fontSize: 16, align: 'center' }} />
                </Container>}
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(StageSelectUI);