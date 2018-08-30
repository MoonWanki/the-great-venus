import React, { Component } from 'react'

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Web3Actions from './store/modules/web3Module';
import abi from '../build/contracts/TGV.json';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import './App.scss';

class App extends Component {

  componentWillMount() {
    getWeb3
    .then(res => {
      this.props.web3Actions.initializeWeb3(res.web3Instance);
      res.web3Instance.currentProvider.publicConfigStore.on('update', this.onPublicConfigStore);
      setInterval(this.updateUserData, 3000);
    })
    .catch(() => {
      console.error('Error finding web3.')
    });

  }

  // 메타마스크에서 계정이나 네트워크 변경됐을 때
  onPublicConfigStore = (selectedAddress, networkVersion) => {
    alert("Network configuration has changed. You will be logged out.");
    window.location.href = '/';
  }

  updateUserData = () => {
    const { web3Instance, userData, web3Actions } = this.props;
    if(typeof web3Instance !== 'undefined') {
      const TGV = require('truffle-contract')(abi);
      TGV.setProvider(web3Instance.currentProvider);
      var TGVInstance;
      web3Instance.eth.getAccounts((error, accounts) => {
          TGV.deployed().then((instance) => {
              TGVInstance = instance;
              return TGVInstance.getMyInfo();
          }).then((result) => {
            if(JSON.stringify(userData)!==JSON.stringify(result)) {
              web3Actions.setUserData(result);
            }
          }).catch((err) => console.log(err));
      });
    } else {
      console.error('Cannot update user data: Web3 is not initialized');
    }
  }

  render() {

    console.log("App rendered");

    const { web3Instance, userData } = this.props;
    console.log(web3Instance);
    
    return (
      <div>
        <h1>The Great Venus</h1>
        <h1>{userData?"환영합니다":"로그인해주세요"}</h1>
        {JSON.stringify(userData)}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    web3Instance: state.web3Module.web3Instance,
    userData: state.web3Module.userData
  }),
  (dispatch) => ({ web3Actions: bindActionCreators(Web3Actions, dispatch) })
)(App);
