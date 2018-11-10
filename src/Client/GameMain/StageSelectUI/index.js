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

const stageDisplayFadeDuration = 500;
const stageDisplayFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStageDisplay = Animated.createAnimatedComponent(StageDisplay);

class StageSelectUI extends Component {

    state = {
        stageDisplayOn: false,
        stageDisplayOffset: new Animated.Value(0),
        stageResult: null,
    }

    clearStage = async (stageNo, units) => {
        try {
            this.props.AppActions.setPreloader(true);
            const roundResultList = await TGVApi.clearStage(this.props.TGV, stageNo, units, this.props.web3.eth.coinbase);
            this.showStageDisplay(stageNo, units, roundResultList);
        } catch(err) {
            console.error(err);
        } finally {
            this.props.AppActions.setPreloader(false);
        }
    }

    showStageDisplay = (stageNo, statueNoList, roundResultList) => {
        this.setState({
            stageResult: {
                stageNo: stageNo,
                statueNoList: statueNoList,
                mobNoList: this.props.gameData.stageInfoList[stageNo-1].map(roundInfo => roundInfo.filter(mobIdx => mobIdx>0)),
                roundResultList: roundResultList,
            },
            stageDisplayOn: true,
        });
        Animated.timing(this.state.stageDisplayOffset, { toValue: 1, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
    }

    // 끝나면 이거 호출하고 까만화면 띄우면 될듯 얘가 알아서 꺼주니까
    dismissStageDisplay = async () => {
        this.props.UserActions.fetchFinney(this.props.web3);
        await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
        Animated.timing(this.state.stageDisplayOffset, { toValue: 0, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
        setTimeout(()=>this.setState({ stageDisplayOn: false, stageResult: null }), stageDisplayFadeDuration);
    }

    renderStageButtons = () => _.times(this.props.gameData.maxStage, i => {
        i++;
        if(i <= this.props.userData.lastStage + 1)
            return <FlatButton x={200*i} y={400} width={150} height={150} text={i} onClick={() => this.clearStage(i, _.times(this.props.userData.numStatues))} />
        else
            return <FlatButton x={200*i} y={400} width={150} height={150} text={i +' (LOCKED)'} />
    });

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                {this.renderStageButtons()}
                <AnimatedFlatButton
                    x={100}
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
        contentY: state.canvasModule.contentY,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(StageSelectUI);