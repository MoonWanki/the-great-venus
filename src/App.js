import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from './store/modules/web3Module';
import * as userActions from './store/modules/userModule';
import * as appActions from './store/modules/appModule';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, AdminPage, Client } from 'Components';

class App extends Component {

  componentDidMount() {

    const { Web3Actions, UserActions, AppActions } = this.props;

    getWeb3
    .then(({ web3Instance }) => {
      Web3Actions.initializeWeb3(web3Instance); // save web3 instance in store
      UserActions.loadUserData(web3Instance); // load user data when initializing web3
      web3Instance.currentProvider.publicConfigStore.on('update', ({ selectedAddress, networkVersion }) => {
        if(this.props.selectedAddress !== selectedAddress || this.props.networkVersion !== networkVersion) {
          window.Materialize.toast('Your account or network has changed!', 1500);
          Web3Actions.setSelectedAddress(selectedAddress);
        }
      });
    });

    // Initial language setting
    switch(window.navigator.language) {
      case "ko-KR":
        AppActions.setLanguage('ko'); break;
      default:
        AppActions.setLanguage('en'); break;
    }

  }

  render() {
    console.log("App rendered");
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/test" component={AdminPage} />
          <Route path="/client" component={Client} />
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
    language: state.appModule.language,
  }),
  (dispatch) => ({
    Web3Actions: bindActionCreators(web3Actions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
    AppActions: bindActionCreators(appActions, dispatch),
  })
)(App);
