import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Collection, CollectionItem, Button } from 'react-materialize';

export default class StageResultModal extends Component {

    render() {
        const { stageResult } = this.props;
        return (
            stageResult ?
            <Modal open={this.props.open} onClose={this.props.onClose} closeOnOverlayClick={false}>
                {stageResult.roundList.map((roundResult, i) => 
                    <Collection key={i}>
                        <CollectionItem className='grey lighten-2'><h5>{stageResult.stageNo} - {i+1}</h5></CollectionItem>
                        <CollectionItem>유닛 정보</CollectionItem>
                        {stageResult.ally.map((unit, i) => <CollectionItem key={i} className='light-green darken-3' active>아군[{i}] &emsp; HP <b>{unit.hp}</b> &emsp; ATK <b>{unit.atk}</b> &emsp; DEF <b>{unit.def}</b> &emsp; CRT <b>{unit.crt}%</b> &emsp; AVD <b>{unit.avd}%</b></CollectionItem>)}
                        {stageResult.enemyList[i].map((unit, i) => <CollectionItem key={i} className='deep-orange accent-4' active>적군[{i}] &emsp; HP <b>{unit.hp}</b> &emsp; ATK <b>{unit.atk}</b> &emsp; DEF <b>{unit.def}</b> &emsp; CRT <b>{unit.crt}%</b> &emsp; AVD <b>{unit.avd}%</b></CollectionItem>)}
                        <CollectionItem>전투 내역</CollectionItem>
                        {roundResult.attackList.map((attack, i) => 
                            attack.way
                            ? <CollectionItem key={i} className='light-green darken-3' active>아군[{attack.from}] ▶ 적군[{attack.to}] &emsp; <b>{attack.damage ? (attack.isCrt ? attack.damage + ' (CRITICAL)' : attack.damage) : 'MISS'}</b></CollectionItem>
                            : <CollectionItem key={i} className='deep-orange accent-4' active>아군[{attack.to}] ◀ 적군[{attack.from}] &emsp; <b>{attack.damage ? (attack.isCrt ? attack.damage + ' (CRITICAL)' : attack.damage) : 'MISS'}</b></CollectionItem>
                        )}
                        <CollectionItem><b>영혼의 결정 {roundResult.gem}</b>개와 <b>{roundResult.exp}</b>의 경험치를 획득하였습니다.</CollectionItem>
                        <CollectionItem><b>{roundResult.victory ? '승리하였습니다.' : '패배하였습니다.'}</b></CollectionItem>
                    </Collection>
                )}
                <Button onClick={this.props.onClose}>확인</Button>
            </Modal> : null
        )
    }
}