import React, { Component } from 'react'

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Web3Actions from './store/modules/web3Module';
import abi from '../build/contracts/TGV.json';

class App extends Component {

  componentWillMount() {
    getWeb3
    .then(res => {
      this.props.web3Actions.initializeWeb3(res.web3Instance);
      setInterval(this.updateUserData, 3000);
    })
    .catch(() => {
      console.error('Error finding web3.')
    });

  }

  updateUserData = () => {
    const { web3, userData, web3Actions } = this.props;
    if(typeof web3 !== 'undefined') {
      const TGV = require('truffle-contract')(abi);
      TGV.setProvider(web3.currentProvider);
      var TGVInstance;
      web3.eth.getAccounts((error, accounts) => {
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

    const { web3, userData } = this.props;
    console.log(web3);
    
    return (
      <div>
        <h1>메타마스크{web3 ? "OK" : "NO"}</h1>
        <h1>{userData?"환영합니다":"로그인해주세요"}</h1>
        {JSON.stringify(userData)}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    web3: state.web3Module.web3,
    userData: state.web3Module.userData
  }),
  (dispatch) => ({ web3Actions: bindActionCreators(Web3Actions, dispatch) })
)(App);
