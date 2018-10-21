import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';
import * as gameActions from 'store/modules/gameModule';
import PropTypes from 'prop-types';
import Animated from "animated";
import Box from './Components/Box';

const AnimatedContainer = Animated.createAnimatedComponent(Container);

class LoadingScreen extends Component {

    state = {
        isLoading: false,
        loadingText: '',
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
        this.setState({ loadingText: '리소스를 불러오고 있습니다.' });
        await this.loadImages();
    }
    
    render() {
        return (
            <AnimatedContainer alpha={this.state.alpha}>
                <Box color={0x0} x={0} y={0} width={this.props.width} height={this.props.height} alpha={1}/>
                <Text text={`로딩 중...${this.state.loadingProgress}%\n${this.state.loadingText}`} style={{ fill: 0xffffff, fontSize: 14 }} />
            </AnimatedContainer>
        )
    }

    loadImages = () => {
        this.context.app.loader
        .add("statue0", require("../images/statue/0.png"))
        .add("statue1", require("../images/statue/1.png"))
        .add("statue2", require("../images/statue/2.png"))
        .add("statue3", require("../images/statue/3.png"))
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

}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        isGameLoaded: state.appModule.isGameLoaded,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(LoadingScreen);

LoadingScreen.contextTypes = {
    app: PropTypes.object,
};