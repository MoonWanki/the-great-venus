import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Collection, CollectionItem } from 'react-materialize';

export default class StageResultModal extends Component {

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
            <Modal open={this.props.open} stageResult={this.props.stageResult} onClose={this.props.onClose} closeOnOverlayClick={false}>
                <Collection header={`${this.props.stageResult.stageNo} 스테이지 클리어 결과`}>
                    {this.props.stageResult.logs.map((log, i) => 
                        log.way === 1
                        ? <CollectionItem key={i} className='light-green darken-3' active>공격&emsp;아군[{log.unit}] → 적군[{log.mob}]&emsp;{log.damage}의 {log.isCrt ? '크리티컬 ' : null}데미지!</CollectionItem>
                        : <CollectionItem key={i} className='deep-orange accent-4' active>피해&emsp;아군[{log.unit}] ← 적군[{log.mob}]&emsp;{log.damage}의 {log.isCrt ? '크리티컬 ' : null}데미지!</CollectionItem>
                    )}
                </Collection>
            </Modal> : null
        )
    }
}