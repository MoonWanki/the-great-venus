import React, { Component } from 'react';
import { Stage } from "react-pixi-fiber";
import LoadingScreen from './LoadingScreen';
import Base from './Base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getWeb3Instance, getTGVInstance } from 'utils/InstanceFactory';
import * as web3Actions from 'store/modules/web3Module';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import Animated from 'animated';
import './index.scss';

class Client extends Component {

    state = {
        isGameReady: false,
        stageWidth: 0,
        stageHeight: 0,
        contentWidth: screen.width,
        contentHeight: screen.height,
        floatingFormPosition: new Animated.Value(0),
    }

    componentDidMount() {
        this.load();
        this.setToFullSize();
        window.onresize = () => this.setToFullSize();
        window.onpopstate = () => {
            window.location.reload();
        };
    }

    load = async() => {
		try {
			const { web3Instance } = await getWeb3Instance();
            this.props.Web3Actions.fetchWeb3Instance(web3Instance);
            const TGVInstance = await getTGVInstance(web3Instance);
            this.props.Web3Actions.fetchTGVInstance(TGVInstance);
            this.props.GameActions.loadGameData(TGVInstance);
            this.props.UserActions.loadMyData(TGVInstance, web3Instance.eth.coinbase);
			web3Instance.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
		} catch (err) {
			console.log(err);
		}
    }
    
    onPublicConfigUpdate = ({ selectedAddress, networkVersion }) => {
        if(this.props.selectedAddress !== selectedAddress) {
            this.props.Web3Actions.setSelectedAddress(selectedAddress);
            window.Materialize.toast(`${this.props.selectedAddress} -> ${selectedAddress}`, 2500);
        } else if(this.props.networkVersion !== networkVersion) {
            window.Materialize.toast(`${this.props.networkVersion} -> ${networkVersion}`, 2500);
        }
    }

    setToFullSize = () => {
        this.setState({
            stageWidth: window.innerWidth,
            stageHeight: window.innerHeight - 6
        });
    }

    onReady = () => {
        this.setState({ isGameReady: true });
        console.log("ready");
    }

    render() {

        const { stageWidth, stageHeight, contentWidth, contentHeight } = this.state;

        return (
            <div className='canvas-wrapper'>
                <Stage options={{ backgroundColor: 0x0 }} width={stageWidth} height={stageHeight} >
                    {this.state.isGameReady
                        ? <Base
                            stageWidth={stageWidth}
                            stageHeight={stageHeight}
                            contentWidth={contentWidth}
                            contentHeight={contentHeight} />
                        : null}
                    <LoadingScreen width={stageWidth} height={stageHeight} onReady={this.onReady}/>
                </Stage>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        selectedAddress: state.web3Module.selectedAddress,
        networkVersion: state.web3Module.networkVersion,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        Web3Actions: bindActionCreators(web3Actions, dispatch),
    })
)(Client);