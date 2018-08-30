import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from './store/modules/web3Module';
import abi from '../build/contracts/TGV.json';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, AdminPage } from 'Components';
import './App.scss';

class App extends Component {

  componentWillMount() {
    getWeb3
    .then(({ web3Instance }) => {
      this.props.Web3Actions.initializeWeb3(web3Instance); // save web3 instance in store
      this.props.Web3Actions.loadUserData(web3Instance); // load user data when initializing web3
      web3Instance.currentProvider.publicConfigStore.on('update', (selectedAddress, networkVersion) => {
        if(web3Instance.currentProvider.publicConfigStore._state.selectedAddress === selectedAddress && web3Instance.currentProvider.publicConfigStore._state.networkVersion === networkVersion) return;
        alert("Network configuration has changed. You will be logged out.");
        window.location.href = '/';
      });
    })
    .catch(() => {
      console.error('Error finding web3.')
    });
  }

  // updateUserData = () => {
  //   const { web3Instance, userData, Web3Actions } = this.props;
  //   if(typeof web3Instance !== 'undefined') {
  //     const TGV = require('truffle-contract')(abi);
  //     TGV.setProvider(web3Instance.currentProvider);
  //     var TGVInstance;
  //     web3Instance.eth.getAccounts((error, accounts) => {
  //       TGV.deployed().then((instance) => {
  //         TGVInstance = instance;
  //         return TGVInstance.getMyInfo();
  //       }).then((result) => {
  //         if(JSON.stringify(userData)!==JSON.stringify(result)) {
  //           Web3Actions.setUserData(result);
  //         }
  //       }).catch((err) => console.log(err));
  //     });
  //   } else {
  //     console.error('Cannot update user data: Web3 is not initialized');
  //   }
  // }

  render() {

    console.log("App rendered");

    const { web3Instance } = this.props;
    console.log(web3Instance);
    
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/test" component={AdminPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(
  (state) => ({
    web3Instance: state.web3Module.web3Instance,
    userData: state.web3Module.userData
  }),
  (dispatch) => ({ Web3Actions: bindActionCreators(web3Actions, dispatch) })
)(App);
