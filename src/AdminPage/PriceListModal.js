import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { Table } from 'react-materialize';

export default class PriceListModal extends Component {

    render() {

        const { equipConfig, statueNo, basicFee } = this.props;
        let iterator = [];
        for(let i=1 ; i<=45 ; i++) iterator.push(i);
        return (
            <Modal open={this.props.open} onClose={this.props.onClose} showCloseIcon={false}>
                {equipConfig ?
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>레벨</th><th>HP</th><th>영결</th><th>요금(FINNEY)</th><th>ATK</th><th>영결</th><th>요금(FINNEY)</th><th>DEF</th><th>영결</th><th>요금(FINNEY)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {iterator.map((level, j) =>
                        <tr key={j}>
                            <th>{level}</th>
                            <td>{equipConfig.extraValueTable[statueNo][0][j]}</td>
                            <td>{j===0 ? '-' : equipConfig.upgradeCostTable[statueNo][0][j-1].sorbiote}</td>
                            <td>{j===0 ? basicFee : equipConfig.upgradeCostTable[statueNo][0][j-1].fee}</td>
                            <td>{equipConfig.extraValueTable[statueNo][1][j]}</td>
                            <td>{j===0 ? '-' : equipConfig.upgradeCostTable[statueNo][1][j-1].sorbiote}</td>
                            <td>{j===0 ? basicFee : equipConfig.upgradeCostTable[statueNo][1][j-1].fee}</td>
                            <td>{equipConfig.extraValueTable[statueNo][2][j]}</td>
                            <td>{j===0 ? '-' : equipConfig.upgradeCostTable[statueNo][2][j-1].sorbiote}</td>
                            <td>{j===0 ? basicFee : equipConfig.upgradeCostTable[statueNo][2][j-1].fee}</td>
                        </tr>)}
                    </tbody>
                </Table> : '로딩 중입니다. 네트워크 상태에 따라 최대 1분까지 소요될 수 있습니다.'}
            </Modal>
        )
    }
}