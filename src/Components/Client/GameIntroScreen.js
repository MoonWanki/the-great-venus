import React, { Component } from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';
import PropTypes from 'prop-types';
import * as PIXI from "pixi.js";
import GameIntroImage from "../../images/game_loading.png";
import Animated from "animated";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

class GameIntroScreen extends Component {

    state = {
        isLoading: false,
        loadingText: '유저 정보를 불러오고 있습니다.',
        loadingProgress: 0,
        screenY: new Animated.Value(0),
    }

    componentDidMount() {
        const t = setTimeout(() => {
            if(this.props.isGameLoaded) {
                this.props.onReady();
                Animated.timing(this.state.screenY, { toValue: 1 }).start();
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
        .add("bg1_1", "../../images/bg1/1.png")
        .add("bg1_2", "../../images/bg1/2.png")
        .add("bg1_3", "../../images/bg1/3.png")
        .add("bg1_4", "../../images/bg1/4.png")
        .add("bg1_5", "../../images/bg1/5.png")
        .add("bg1_6", "../../images/bg1/6.png")
        .add("bg1_7", "../../images/bg1/7.png")
        .add("bg2_1", "../../images/bg2/1.png")
        .add("bg2_2", "../../images/bg2/2.png")
        .add("bg2_3", "../../images/bg2/3.png")
        .add("bg2_4", "../../images/bg2/4.png")
        .add("bg2_5", "../../images/bg2/5.png")
        .add("bg2_6", "../../images/bg2/6.png")
        .add("bg2_7", "../../images/bg2/7.png")
        .add("bg2_8", "../../images/bg2/8.png")
        .add("bg2_9", "../../images/bg2/9.png")
        .add("bg3_1", "../../images/bg3/1.png")
        .add("bg3_2", "../../images/bg3/2.png")
        .add("bg3_3", "../../images/bg3/3.png")
        .add("bg3_4", "../../images/bg3/4.png")
        .add("bg3_5", "../../images/bg3/5.png")
        .add("bg3_6", "../../images/bg3/6.png")
        .add("bg3_7", "../../images/bg3/7.png")
        .add("bg3_8", "../../images/bg3/8.png")
        .add("bg4_1", "../../images/bg4/1.png")
        .add("bg4_2", "../../images/bg4/2.png")
        .add("bg4_3", "../../images/bg4/3.png")
        .add("bg4_4", "../../images/bg4/4.png")
        .add("bg4_5", "../../images/bg4/5.png")
        .on("progress", (loader, resource) => {
            this.setState({ loadingText: '리소스를 불러오고 있습니다: ' + resource.name, loadingProgress: Math.floor(loader.progress) })
        })
        .load((loader, resources) => {
            this.setState({ isLoading: false });
            this.props.AppActions.gameHasLoaded();
            this.props.onReady();
            Animated.timing(this.state.screenY, { toValue: 1 }).start();
        });
    }

    render() {
        return (
            <AnimatedContainer
                y={this.state.screenY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -this.props.height],
                })}
                {...this.props}>
                <Sprite
                    anchor={new PIXI.Point(0.5, 0.5)}
                    position={[this.props.width/2, this.props.height/2]}
                    texture={PIXI.Texture.fromImage(GameIntroImage)}
                    />

                <Text text={`로딩 중...${this.state.loadingProgress}%\n${this.state.loadingText}`} style={{ fill: 0xffff00, fontSize: 14 }} />
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