import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as web3Actions from 'store/modules/web3Module';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import IntroScreen from './IntroScreen';
import GameMain from './GameMain';
import Animated from 'animated';
import PropTypes from 'prop-types';

class GameBase extends Component {

    state = {
        isReady: false,
        loadingProgress: 0,
        loadingContent: '',
        introScreenOn: true,
        introScreenOffset: new Animated.Value(1),
        selectedAddress: null,
        networkVersion: null,
    }

    componentDidMount = () => {
        this.load();
    }
    
    load = async () => {
        try {
            await this.loadGame();
            this.loadResources();
        } catch (err) {
            console.error(err);
        }
    }

    loadGame = async() => {
        // load web3
        let res = await this.props.Web3Actions.fetchWeb3();
        const web3 = res.value;
        web3.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
        // load TGV
        res = await this.props.Web3Actions.fetchTGV(web3);
        const TGV = res.value;
        // load game data
        await this.props.GameActions.fetchGameData(TGV);
        // load user data
        await this.props.UserActions.fetchUserData(TGV, web3.eth.coinbase);
    }
    
    onPublicConfigUpdate = ({ selectedAddress, networkVersion }) => {
        if(this.state.selectedAddress !== selectedAddress || this.state.networkVersion !== networkVersion) {
            this.setState({ selectedAddress: selectedAddress, networkVersion: networkVersion });
            if(this.state.isReady) {
                this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
            } else {
                this.load();
            }
        }
    }

    dismissIntroScreen = () => {
        Animated.timing(this.state.introScreenOffset, { toValue: 0, duration: 2000 }).start();
        setTimeout(() => this.setState({ introScreenOn: false }), 2000);
    }

    render() {
        return (
            <Fragment>
                {this.state.isReady && <GameMain {...this.props} />}
                {this.state.introScreenOn && <IntroScreen
                    offset={this.state.introScreenOffset}
                    onReload={this.load}
                    loadingProgress={this.state.loadingProgress}
                    loadingContent={this.state.loadingContent}
                    {...this.props} />
                }
            </Fragment>
        );
    }

    loadResources = () => {
        this.context.app.loader
        .add("intro_credit1", require("../images/intro_credit1.png"))
        .add("intro_credit2", require("../images/intro_credit2.png"))
        .add("statue0_skin1", require("../images/statue/0/skin/1.svg"))
        .add("statue0_skin2", require("../images/statue/0/skin/2.svg"))
        .add("statue0_skin3", require("../images/statue/0/skin/3.svg"))
        .add("statue0_ear1", require("../images/statue/0/ear/1.svg"))
        .add("statue0_ear2", require("../images/statue/0/ear/2.svg"))
        .add("statue0_ear3", require("../images/statue/0/ear/3.svg"))
        .add("statue0_eye1", require("../images/statue/0/eye/1.svg"))
        .add("statue0_eye2", require("../images/statue/0/eye/2.svg"))
        .add("statue0_eye3", require("../images/statue/0/eye/3.svg"))
        .add("statue0_eye4", require("../images/statue/0/eye/4.svg"))
        .add("statue0_hair1", require("../images/statue/0/hair/1.svg"))
        .add("statue0_hair2", require("../images/statue/0/hair/2.svg"))
        .add("statue0_hair3", require("../images/statue/0/hair/3.svg"))
        .add("statue0_hair4", require("../images/statue/0/hair/4.svg"))
        .add("statue0_hair5", require("../images/statue/0/hair/5.svg"))
        .add("statue0", require("../images/statue/0/default.svg"))
        .add("statue1", require("../images/statue/1/default.svg"))
        .add("statue2", require("../images/statue/2/default.svg"))
        .add("statue3", require("../images/statue/3/default.svg"))
        .add("middle_cloud", require("../images/background/middle_cloud.png"))
        .add("bg_main1_sky", require("../images/background/main/1/sky.png"))
        .add("bg_main1_1", require("../images/background/main/1/1.png"))
        .add("bg_main1_2", require("../images/background/main/1/2.png"))
        .add("bg_main1_3", require("../images/background/main/1/3.png"))
        .add("bg_main1_4", require("../images/background/main/1/4.png"))
        .add("bg_main1_5", require("../images/background/main/1/5.png"))
        .add("bg_main1_6", require("../images/background/main/1/6.png"))
        .add("bg_main1_7", require("../images/background/main/1/7.png"))
        .add("bg_main2_1", require("../images/background/main/2/1.png"))
        .add("bg_main2_2", require("../images/background/main/2/2.png"))
        .add("bg_main2_3", require("../images/background/main/2/3.png"))
        .add("bg_main2_4", require("../images/background/main/2/4.png"))
        .add("bg_main2_5", require("../images/background/main/2/5.png"))
        .add("bg_main2_6", require("../images/background/main/2/6.png"))
        .add("bg_main2_7", require("../images/background/main/2/7.png"))
        .add("bg_main2_8", require("../images/background/main/2/8.png"))
        .add("bg_main2_9", require("../images/background/main/2/9.png"))
        .add("bg_main3_1", require("../images/background/main/3/1.png"))
        .add("bg_main3_2", require("../images/background/main/3/2.png"))
        .add("bg_main3_3", require("../images/background/main/3/3.png"))
        .add("bg_main3_4", require("../images/background/main/3/4.png"))
        .add("bg_main3_5", require("../images/background/main/3/5.png"))
        .add("bg_main3_6", require("../images/background/main/3/6.png"))
        .add("bg_main3_7", require("../images/background/main/3/7.png"))
        .add("bg_main3_8", require("../images/background/main/3/8.png"))
        .add("bg_main4_1", require("../images/background/main/4/1.png"))
        .add("bg_main4_2", require("../images/background/main/4/2.png"))
        .add("bg_main4_3", require("../images/background/main/4/3.png"))
        .add("bg_main4_4", require("../images/background/main/4/4.png"))
        .add("bg_main4_5", require("../images/background/main/4/5.png"))
        .add("bg_showroom", require("../images/background/showroom/1.png"))
        .add("bg_forge1", require("../images/background/forge/1.jpg"))
        .add("bg_colosseum_lobby", require("../images/background/colosseum/lobby/1.jpg"))
        .add("bg_field1_1_1", require("../images/background/field/1/1/1.png"))
        .add("bg_field1_1_2", require("../images/background/field/1/1/2.png"))
        .add("bg_field1_1_3", require("../images/background/field/1/1/3.png"))
        .add("bg_field1_1_4", require("../images/background/field/1/1/4.png"))
        .add("bg_field1_1_5", require("../images/background/field/1/1/5.png"))
        .add("bg_field1_1_6", require("../images/background/field/1/1/6.png"))
        .add("bg_field1_1_7", require("../images/background/field/1/1/7.png"))
        .add("bg_field1_2_1", require("../images/background/field/1/2/1.png"))
        .add("bg_field1_2_2", require("../images/background/field/1/2/2.png"))
        .add("bg_field1_2_3", require("../images/background/field/1/2/3.png"))
        .add("bg_field1_2_4", require("../images/background/field/1/2/4.png"))
        .add("bg_field1_2_5", require("../images/background/field/1/2/5.png"))
        .add("bg_field1_2_6", require("../images/background/field/1/2/6.png"))
        .add("bg_field1_2_7", require("../images/background/field/1/2/7.png"))
        .add("bg_field1_2_8", require("../images/background/field/1/2/8.png"))
        .add("bg_field1_3_1", require("../images/background/field/1/3/1.png"))
        .add("bg_field1_3_2", require("../images/background/field/1/3/2.png"))
        .add("bg_field1_3_3", require("../images/background/field/1/3/3.png"))
        .add("bg_field1_3_4", require("../images/background/field/1/3/4.png"))
        .add("bg_field1_3_5", require("../images/background/field/1/3/5.png"))
        .add("bg_field1_3_6", require("../images/background/field/1/3/6.png"))
        .add("bg_field2_1_1", require("../images/background/field/2/1/1.png"))
        .add("bg_field2_1_2", require("../images/background/field/2/1/2.png"))
        .add("bg_field2_1_3", require("../images/background/field/2/1/3.png"))
        .add("bg_field2_1_4", require("../images/background/field/2/1/4.png"))
        .add("bg_field2_1_5", require("../images/background/field/2/1/5.png"))
        .add("bg_field2_1_6", require("../images/background/field/2/1/6.png"))
        .add("bg_field2_1_7", require("../images/background/field/2/1/7.png"))
        .add("bg_field2_1_8", require("../images/background/field/2/1/8.png"))
        .add("bg_field2_2_1", require("../images/background/field/2/2/1.png"))
        .add("bg_field2_2_2", require("../images/background/field/2/2/2.png"))
        .add("bg_field2_2_3", require("../images/background/field/2/2/3.png"))
        .add("bg_field2_2_4", require("../images/background/field/2/2/4.png"))
        .add("bg_field2_2_5", require("../images/background/field/2/2/5.png"))
        .add("bg_field2_2_6", require("../images/background/field/2/2/6.png"))
        .add("bg_field2_3_1", require("../images/background/field/2/3/1.png"))
        .add("bg_field2_3_2", require("../images/background/field/2/3/2.png"))
        .add("bg_field2_3_3", require("../images/background/field/2/3/3.png"))
        .add("bg_field2_3_4", require("../images/background/field/2/3/4.png"))
        .add("bg_field2_3_5", require("../images/background/field/2/3/5.png"))
        .add("bg_field2_3_6", require("../images/background/field/2/3/6.png"))
        .add("bg_field3_1_1", require("../images/background/field/3/1/1.png"))
        .add("bg_field3_1_2", require("../images/background/field/3/1/2.png"))
        .add("bg_field3_1_3", require("../images/background/field/3/1/3.png"))
        .add("bg_field3_1_4", require("../images/background/field/3/1/4.png"))
        .add("bg_field3_1_5", require("../images/background/field/3/1/5.png"))
        .add("bg_field3_1_6", require("../images/background/field/3/1/6.png"))
        .add("bg_field3_1_7", require("../images/background/field/3/1/7.png"))
        .add("bg_field3_1_8", require("../images/background/field/3/1/8.png"))
        .add("bg_field3_1_9", require("../images/background/field/3/1/9.png"))
        .add("bg_field3_2_1", require("../images/background/field/3/2/1.png"))
        .add("bg_field3_2_2", require("../images/background/field/3/2/2.png"))
        .add("bg_field3_2_3", require("../images/background/field/3/2/3.png"))
        .add("bg_field3_2_4", require("../images/background/field/3/2/4.png"))
        .add("bg_field3_2_5", require("../images/background/field/3/2/5.png"))
        .add("bg_field3_2_6", require("../images/background/field/3/2/6.png"))
        .add("bg_field3_3_1", require("../images/background/field/3/3/1.png"))
        .add("bg_field3_3_2", require("../images/background/field/3/3/2.png"))
        .add("bg_field3_3_3", require("../images/background/field/3/3/3.png"))
        .add("bg_field3_3_4", require("../images/background/field/3/3/4.png"))
        .add("bg_field3_3_5", require("../images/background/field/3/3/5.png"))
        .add("bg_field3_3_6", require("../images/background/field/3/3/6.png"))
        .add("bg_field3_3_7", require("../images/background/field/3/3/7.png"))
        .add("bg_field3_3_8", require("../images/background/field/3/3/8.png"))
        .add("bg_stageselect1_1", require("../images/background/stageselect/1/1.png"))
        .add("bg_stageselect1_2", require("../images/background/stageselect/1/2.png"))
        .add("bg_stageselect1_3", require("../images/background/stageselect/1/3.png"))
        .on('progress', (loader, resource) => {
            this.setState({ loadingContent: resource.name, loadingProgress: Math.ceil(loader.progress) })
        })
        .load(() => {
            this.setState({
                loadingProgress: 100,
                isReady: true
            });
            this.dismissIntroScreen();
        });
    }
}

export default connect(
    (state) => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        Web3Actions: bindActionCreators(web3Actions, dispatch),
    })
)(GameBase);

GameBase.contextTypes = {
    app: PropTypes.object,
};