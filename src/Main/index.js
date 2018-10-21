import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from 'store/modules/web3Module';
import { getWeb3Instance } from 'utils/InstanceFactory';
import { Home, PageNotFound } from './Pages';

class Main extends Component {

    componentDidMount = () => {
        this.load();
    }

    load = async() => {
		try {
            const { web3Instance } = await getWeb3Instance();
            this.props.Web3Actions.fetchWeb3Instance(web3Instance);
			// web3Instance.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
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