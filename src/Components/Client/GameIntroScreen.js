import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';
import PropTypes from 'prop-types';
import Animated from "animated";
import Box from './Box';

const AnimatedContainer = Animated.createAnimatedComponent(Container);

class GameIntroScreen extends Component {

    state = {
        isLoading: false,
        loadingText: '유저 정보를 불러오고 있습니다.',
        loadingProgress: 0,
        alpha: new Animated.Value(1),
    }

    componentDidMount() {
        const t = setTimeout(() => {
            if(this.props.isGameLoaded) {
                this.props.onReady();
                this.setState({ isLoading: false, loadingText: '로딩이 끝났습니다!' });
                Animated.timing(this.state.alpha, { toValue: 0 }).start();
            } else if(this.props.web3Instance) {
                this.setState({ isLoading: true });
                this.loadGame();
            } else {
                setTimeout(t, 1000);
            }
        }, 1000);
    }

    loadGame = async() => {
        await this.props.UserActions.loadUserData(this.props.web3Instance);
        this.setState({ loadingText: '리소스를 불러오고 있습니다.' });
        await this.loadImages();
    }

    loadImages = () => {
        this.context.app.loader
        .add("bg1_1", require("../../images/bg1/1.png"))
        .add("bg1_2", require("../../images/bg1/2.png"))
        .add("bg1_3", require("../../images/bg1/3.png"))
        .add("bg1_4", require("../../images/bg1/4.png"))
        .add("bg1_5", require("../../images/bg1/5.png"))
        .add("bg1_6", require("../../images/bg1/6.png"))
        .add("bg1_7", require("../../images/bg1/7.png"))
        .add("bg2_1", require("../../images/bg2/1.png"))
        .add("bg2_2", require("../../images/bg2/2.png"))
        .add("bg2_3", require("../../images/bg2/3.png"))
        .add("bg2_4", require("../../images/bg2/4.png"))
        .add("bg2_5", require("../../images/bg2/5.png"))
        .add("bg2_6", require("../../images/bg2/6.png"))
        .add("bg2_7", require("../../images/bg2/7.png"))
        .add("bg2_8", require("../../images/bg2/8.png"))
        .add("bg2_9", require("../../images/bg2/9.png"))
        .add("bg3_1", require("../../images/bg3/1.png"))
        .add("bg3_2", require("../../images/bg3/2.png"))
        .add("bg3_3", require("../../images/bg3/3.png"))
        .add("bg3_4", require("../../images/bg3/4.png"))
        .add("bg3_5", require("../../images/bg3/5.png"))
        .add("bg3_6", require("../../images/bg3/6.png"))
        .add("bg3_7", require("../../images/bg3/7.png"))
        .add("bg3_8", require("../../images/bg3/8.png"))
        .add("bg4_1", require("../../images/bg4/1.png"))
        .add("bg4_2", require("../../images/bg4/2.png"))
        .add("bg4_3", require("../../images/bg4/3.png"))
        .add("bg4_4", require("../../images/bg4/4.png"))
        .add("bg4_5", require("../../images/bg4/5.png"))
        .on("progress", (loader, resource) => {
            this.setState({ loadingText: '리소스를 불러오고 있습니다: ' + resource.name, loadingProgress: Math.floor(loader.progress) })
        })
        .load((loader) => {
            this.setState({ isLoading: false, loadingText: '로딩이 끝났습니다!', loadingProgress: Math.floor(loader.progress) });
            this.props.AppActions.gameHasLoaded();
            this.props.onReady();
            Animated.timing(this.state.alpha, { toValue: 0, duration: 1500 }).start();
        });
    }

    render() {
        return (
            <AnimatedContainer alpha={this.state.alpha}>
                <Box color={0x0} x={0} y={0} width={this.props.width} height={this.props.height} alpha={1}/>
                <Text text={`로딩 중...${this.state.loadingProgress}%\n${this.state.loadingText}`} style={{ fill: 0xffffff, fontSize: 14 }} />
            </AnimatedContainer>
        )
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        isGameLoaded: state.appModule.isGameLoaded,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(GameIntroScreen);

GameIntroScreen.contextTypes = {
    app: PropTypes.object,
};