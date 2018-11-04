import React, { Component, Fragment } from 'react';
import FlatButton from '../../Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as TGVApi from 'utils/TGVApi';
import * as appActions from 'store/modules/appModule';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class StageSelectUI extends Component {

    clearStage = async (stageNo, units) => {
        try {
            this.props.AppActions.setPreloader(true);
            await TGVApi.clearStage(this.props.TGV, stageNo, units, this.props.web3.eth.coinbase);
            window.Materialize.toast(stageNo + ' 스테이지에 입장합니다', 1500);
            await this.update();
        } catch(err) {
            console.error(err);
        } finally {
            this.props.AppActions.setPreloader(false);
        }
    }

    update = async () => {
        await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
        this.props.UserActions.fetchFinney(this.props.web3);
    }

    renderStageButtons = () => _.times(this.props.gameData.maxStage, i => {
        i++;
        if(i <= this.props.userData.lastStage + 1)
            return <FlatButton x={200*i} y={400} width={150} height={150} text={i} onClick={() => this.clearStage(i, _.times(this.props.userData.numStatues))} />
        else
            return <FlatButton x={200*i} y={400} width={150} height={150} text={i +' (LOCKED)'} />
    });

    render() {
        const { offset, stageHeight } = this.props;
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