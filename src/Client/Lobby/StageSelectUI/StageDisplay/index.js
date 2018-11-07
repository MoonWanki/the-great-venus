import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import PropTypes from 'prop-types';
import Animated from 'animated';
import StageField from './StageField';
import { connect } from 'react-redux';
import * as TGVApi from 'utils/TGVApi';

const loadingScreenFadeDuration = 800;

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);

class StageDisplay extends Component {

    state = {
        loadingScreenOffset: new Animated.Value(1),
        stageFieldOn: false,
        currentRound: 1,
        userLevel: this.props.userData.level,
        userSoul: this.props.userData.soul,
        userExp: this.props.userData.exp,
    }

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    componentDidMount = () => {
        this.showStageField();
    }

    showStageField = async () => {
        const initialStatues = await Promise.all(this.props.stageResult.statueNoList.map(statueNo => TGVApi.getStatueRawSpec(this.props.TGV, statueNo, this.state.userLevel)));
        const initialMobs = await Promise.all(this.props.stageResult.mobNoList[this.state.currentRound - 1].map(mobNo => TGVApi.getMobRawSpec(this.props.TGV, mobNo, this.state.userLevel)));
        await this.sleep(1000);
        this.setState({
            initialStatues: initialStatues,
            initialMobs: initialMobs,
            stageFieldOn: true,
        });
        Animated.timing(this.state.loadingScreenOffset, { toValue: 0, duration: loadingScreenFadeDuration }).start();
    }

    onFinishRound = () => {
        if(this.state.currentRound < this.props.stageResult.roundResultList.length) {
            Animated.timing(this.state.loadingScreenOffset, { toValue: 1, duration: loadingScreenFadeDuration }).start();
            setTimeout(() => {
                this.setState({ stageFieldOn: false, initialStatues: null, initialMobs: null, currentRound: this.state.currentRound + 1 });
                this.showStageField();
            }, loadingScreenFadeDuration);
        } else {
            this.props.onFinish();
        }
    }

    render() {
        const { stageWidth, stageHeight, contentWidth, contentHeight } = this.props;
        return (
            <Container alpha={this.props.offset}>
                {this.state.stageFieldOn && <StageField
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                    contentWidth={contentWidth}
                    contentHeight={contentHeight}
                    roundResult={this.props.stageResult.roundResultList[this.state.currentRound - 1]}
                    initialStatues={this.state.initialStatues}
                    initialMobs={this.state.initialMobs}
                    onFinish={this.onFinishRound} />}
            <AnimatedSprite
                width={contentWidth}
                height={contentWidth*9/16}
                alpha={this.state.loadingScreenOffset}
                texture={this.context.app.loader.resources.stage_field_loading_screen.texture} />
            </Container>
        );
    }
}

StageDisplay.contextTypes = {
    app: PropTypes.object,
};

export default connect(
    state => ({
        TGV: state.web3Module.TGV,
        userData: state.userModule.userData,
    }),
)(StageDisplay);