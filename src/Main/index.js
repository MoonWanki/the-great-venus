import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from 'store/modules/web3Module';
import { Home, PageNotFound } from './Pages';

class Main extends Component {

    componentDidMount = () => {
        this.load();
    }

    load = async() => {
		try {
            let res = await this.props.Web3Actions.fetchWeb3();
            const web3 = res.value;
            await this.props.Web3Actions.fetchTGV(web3);
			web3.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
		} catch (err) {
			console.log(err);
		}
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' component={Home} />
                <Route component={PageNotFound} />
            </Switch>
        )
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        selectedAddress: state.web3Module.selectedAddress,
        networkVersion: state.web3Module.networkVersion,
    }),
    (dispatch) => ({
        Web3Actions: bindActionCreators(web3Actions, dispatch),
    })
)(Main);