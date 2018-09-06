import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from './store/modules/web3Module';
import * as userActions from './store/modules/userModule';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, AdminPage } from 'Components';

class App extends Component {

  componentDidMount() {

    const { Web3Actions, UserActions, selectedAddress, networkVersion } = this.props;

    getWeb3
    .then(({ web3Instance }) => {
      console.log('finding web3.');
      Web3Actions.initializeWeb3(web3Instance); // save web3 instance in store
      UserActions.loadUserData(web3Instance); // load user data when initializing web3
      web3Instance.currentProvider.publicConfigStore.on('update', ({ newSelectedAddress, newNetworkVersion }) => {
        if(selectedAddress !== newSelectedAddress || networkVersion !== newNetworkVersion) {
          window.Materialize.toast('Your account or network has changed!', 1500);
          Web3Actions.setSelectedAddress(newSelectedAddress);
        }
      });
    })
  }

  render() {
    console.log("App rendered");
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/test" component={AdminPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(
  (state) => ({
    web3Instance: state.web3Module.web3Instance,
    selectedAddress: state.web3Module.selectedAddress,
    networkVersion: state.web3Module.networkVersion,
    userData: state.web3Module.userData,
  }),
  (dispatch) => ({
    Web3Actions: bindActionCreators(web3Actions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
  })
)(App);
