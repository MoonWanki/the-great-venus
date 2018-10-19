import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import { Collection, CollectionItem } from 'react-materialize';

class StageResultModal extends Component {

    state = {
        units: null,
        enemy: null,
    }

    componentDidMount = () => {
        const { stageResult } = this.props;
        if(stageResult) {
            this.setState({ enemy: this.props.gameData.stageInfoList[stageResult.stageNo - 1] });
        }
    }

    getExtraValueByEquip = () => {

    }

    getExtraValueByLevel = () => {
        
    }

    render() {
        return (
            this.props.stageResult ?
            <Modal open={this.props.open} onClose={this.props.UserActions.finishShowingStageResult} closeOnOverlayClick={false}>
                <Collection header={`${this.props.stageResult.stageNo} 스테이지 클리어 결과`}>
                    {this.props.stageResult.logs.map((log, i) => 
                        log.way === 1
                        ? <CollectionItem key={i} className='light-green darken-3' active>공격&emsp;아군[{log.unit}] → 적군[{log.mob}]&emsp;{log.damage}의 {log.isCrt ? '크리티컬 ' : null}데미지!</CollectionItem>
                        : <CollectionItem dky={i} className='deep-orange accent-4' active>피해&emsp;아군[{log.unit}] ← 적군[{log.mob}]&emsp;{log.damage}의 {log.isCrt ? '크리티컬 ' : null}데미지!</CollectionItem>
                    )}
                </Collection>
            </Modal> : null
        )
    }
}

export default connect(
    (state) => ({
        userData: state.userModule.userData,
        gameData: state.gameModule.gameData,
        isStageResultShowing: state.userModule.isStageResultShowing,
        stageResult: state.userModule.stageResult,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
    })
)(StageResultModal);
