import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Collection, CollectionItem } from 'react-materialize';

export default class StageResultModal extends Component {

    state = {
        ally: null,
        enemyList: [],
    }

    // fetchStageInfo = () => {
    //     this.setState({
    //         enemyList: this.props.stageInfo.map(roundInfo => {
    //             roundInfo.map(mobInfo => {
    //                 mobInfo
    //             });
    //         })
    //     });
    // }

    render() {
        const { stageResult } = this.props;
        // if(stageResult) this.fetchStageInfo();
        return (
            stageResult ?
            <Modal open={this.props.open} onClose={this.props.onClose} closeOnOverlayClick={false}>
                {stageResult.roundList.map((roundResult, i) => 
                    <Collection key={i}>
                        <CollectionItem className='grey lighten-2'><h5>{stageResult.stageNo} - {i+1}</h5></CollectionItem>
                        <CollectionItem>유닛 정보</CollectionItem>
                        {stageResult.ally.map((unit, i) => <CollectionItem key={i} className='light-green darken-3' active>아군[{i}] &emsp; HP: <b>{unit.hp.default + unit.hp.extra}</b> &emsp; ATK: <b>{unit.atk.default + unit.atk.extra}</b> &emsp; DEF: <b>{unit.def.default + unit.def.extra}</b> &emsp; CRT: <b>{unit.crt.default + unit.crt.extra}</b> &emsp; AVD: <b>{unit.avd.default + unit.avd.extra}</b></CollectionItem>)}
                        {stageResult.enemyList[i].map((unit, i) => <CollectionItem key={i} className='deep-orange accent-4' active>적군[{i}] &emsp; HP: <b>{unit.hp}</b> &emsp; ATK: <b>{unit.atk}</b> &emsp; DEF: <b>{unit.def}</b> &emsp; CRT: <b>{unit.crt}</b> &emsp; AVD: <b>{unit.avd}</b></CollectionItem>)}
                        <CollectionItem>전투 내역</CollectionItem>
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