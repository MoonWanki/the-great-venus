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

const stageDisplayFadeDuration = 800;

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
            this.props.AppActions.setPreloader(false);
            this.showStageDisplay(stageNo, units, roundResultList);
        } catch(err) {
            console.error(err);
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
        Animated.timing(this.state.stageDisplayOffset, { toValue: 1, duration: stageDisplayFadeDuration }).start();
    }

    // 끝나면 이거 호출하고 까만화면 띄우면 될듯 얘가 알아서 꺼주니까
    dismissStageDisplay = async () => {
        this.props.UserActions.fetchFinney(this.props.web3);
        await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
        Animated.timing(this.state.stageDisplayOffset, { toValue: 0, duration: stageDisplayFadeDuration }).start();
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
        const { offset, contentWidth, contentHeight, stageWidth, stageHeight } = this.props;
        return (
            <Fragment>
                {this.renderStageButtons()}
                <AnimatedFlatButton
                    x={100}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'BACK TO SHOWROOM'}
                    onClick={this.props.onBackButtonClick} />

                {this.state.stageDisplayOn && <AnimatedStageDisplay
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                    contentWidth={contentWidth}
                    contentHeight={contentHeight}
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
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(StageSelectUI);