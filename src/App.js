import React, { Component } from 'react'

import getWeb3 from './utils/getWeb3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from './store/reducers/web3Reducer';

class App extends Component {

  componentWillMount() {
    getWeb3
    .then(res => {
      console.log(res.web3Instance);
      this.props.Web3Actions.initializeWeb3(res.web3Instance);
    })
    .catch(() => {
      console.log('Error finding web3.')
    });
  }

  render() {
    console.log(this.props.web3);
    return (
      <div>
        닉네임 설정
        <input></input>
        <button onClick={this.props.Web3Actions.login}>로그인</button>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    web3: state.web3
  }),
  (dispatch) => ({ Web3Actions: bindActionCreators(web3Actions, dispatch) })
)(App);
