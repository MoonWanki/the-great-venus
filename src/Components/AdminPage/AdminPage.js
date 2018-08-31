import React, { Component } from 'react';

import abi from '../../../build/contracts/TGV.json';
import { connect } from 'react-redux';
const contract = require('truffle-contract');

class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadingConfig: false,
            
        }
    }

    setToDefault = async () => {
        this.setState({ isLoadingConfig: true });
        const { web3Instance } = this.props;
        const TGV = contract(abi);
        TGV.setProvider(web3Instance.currentProvider);
        web3Instance.eth.getCoinbase((err, coinbase) => {
            if (!err) {
                TGV.deployed()
                .then(instance => {
                    return instance.setToDefault({ from: coinbase });
                }).catch(err => {
                    console.error(err);
                })
            } else {
                console.error("error in getCoinbase() in loadConfig()");
            }
        });
    }

    loadConfig = async () => {
        console.log("a");
        this.setState({ isLoadingConfig: true });
        const { web3Instance } = this.props;
        const TGV = contract(abi);
        TGV.setProvider(web3Instance.currentProvider);
        web3Instance.eth.getCoinbase((err, coinbase) => {
            if (!err) {
                TGV.deployed()
                .then(instance => {
                    return instance.statueInfoList(1);
                }).then(statueInfoList => {
                    console.log(statueInfoList);
                }).catch(err => {
                    console.error(err);
                })
            } else {
                console.error("error in getCoinbase() in loadConfig()");
            }
        });
    }

    render() {
        return (
            <div>
                관리자페이지
                <button onClick={this.setToDefault}>초기화</button>
                <button onClick={this.loadConfig}>줄리앙 스펙 로그 출력</button>
            </div>
        );
    }
}

export default connect(
  (state) => ({
    web3Instance: state.web3Module.web3Instance,
  })
)(AdminPage);