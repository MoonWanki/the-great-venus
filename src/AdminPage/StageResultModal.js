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

    render() {
        const { stageResult } = this.props;
        return (
            stageResult ?
            <Modal open={this.props.open} onClose={this.props.onClose} closeOnOverlayClick={false}>
                {stageResult.roundList.map((roundResult, i) => 
                    <Collection key={i}>
                        <CollectionItem><h5>{stageResult.stageNo} - {i+1}</h5></CollectionItem>
                        {roundResult.attackList.map((attack, i) => 
                            attack.way
                            ? <CollectionItem key={i} className='light-green darken-3' active>아군[{attack.unit}] ▶ 적군[{attack.mob}] &emsp; <b>{attack.damage ? (attack.isCrt ? attack.damage + ' (CRITICAL)' : attack.damage) : 'MISS'}</b></CollectionItem>
                            : <CollectionItem key={i} className='deep-orange accent-4' active>아군[{attack.unit}] ◀ 적군[{attack.mob}] &emsp; <b>{attack.damage ? (attack.isCrt ? attack.damage + ' (CRITICAL)' : attack.damage) : 'MISS'}</b></CollectionItem>
                        )}
                        <CollectionItem><b>{roundResult.gold}</b>골드와 <b>{roundResult.exp}</b>의 경험치를 획득하였습니다.</CollectionItem>
                        <CollectionItem><b>{roundResult.victory ? '승리하였습니다.' : '패배하였습니다.'}</b></CollectionItem>
                    </Collection>
                )}
            </Modal> : null
        )
    }
}