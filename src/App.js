import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from './store/modules/web3Module';
import * as userActions from './store/modules/userModule';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, AdminPage } from 'Components';

class App extends Component {

  componentWillMount() {
    getWeb3
    .then(({ web3Instance }) => {
      console.log('finding web3.');
      this.props.Web3Actions.initializeWeb3(web3Instance); // save web3 instance in store
      this.props.UserActions.loadUserData(web3Instance); // load user data when initializing web3
      web3Instance.currentProvider.publicConfigStore.on('update', ({ selectedAddress, networkVersion }) => {
        if(this.props.selectedAddress !== selectedAddress || this.props.networkVersion !== networkVersion) {
          console.log(this.props.networkVersion + " -> " + networkVersion);
          alert("Your account or network has changed.");
          window.location.href = '/';
        }
      });
    })
    .catch(() => {
      console.error('Error finding web3.')
    });
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
