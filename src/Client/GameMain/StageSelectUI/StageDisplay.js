import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';
import Animated from 'animated';
import Field from 'Client/Components/Field';
import { connect } from 'react-redux';
import Background from 'Client/Components/Background';
import * as TGVApi from 'utils/TGVApi';
import Easing from 'animated/lib/Easing';

const loadingScreenFadeDuration = 500;
const loadingScreenFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);

class StageDisplay extends Component {

    state = {
        loadingScreenOffset: new Animated.Value(1),
        fieldBGOffset: new Animated.Value(0),
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
        const initialStatues = await Promise.all(this.props.stageResult.statueNoList.map(statueNo => TGVApi.getStatueSpec(this.props.TGV, this.state.userLevel, statueNo, this.props.userData)));
        const initialMobs = await Promise.all(this.props.stageResult.mobNoList[this.state.currentRound - 1].map(mobNo => TGVApi.getMobRawSpec(this.props.TGV, mobNo, this.state.userLevel)));
        await this.sleep(1000);
        this.setState({
            initialStatues: initialStatues,
            initialMobs: initialMobs,
            stageFieldOn: true,
        });
        Animated.timing(this.state.loadingScreenOffset, { toValue: 0, duration: loadingScreenFadeDuration, easing: loadingScreenFadeEasing }).start();
    }

    onFinishRound = () => {
        if(this.state.currentRound < this.props.stageResult.roundResultList.length) {
            Animated.timing(this.state.loadingScreenOffset, { toValue: 1, duration: loadingScreenFadeDuration, easing: loadingScreenFadeEasing }).start();
            setTimeout(() => {
                this.setState({ stageFieldOn: false, initialStatues: null, initialMobs: null, currentRound: this.state.currentRound + 1 });
                this.showStageField();
            }, loadingScreenFadeDuration);
        } else {
            this.props.onFinish();
        }
    }

    render() {
        const { width, height } = this.props;
        return (
            <Container alpha={this.props.offset}>
                <Background
                    theme={`stage_field1_1`}
                    width={this.state.fieldBGOffset}
                    height={height}
                    offsetX={0}
                    offsetY={0} />
                {this.state.stageFieldOn && <Field
                    width={width}
                    height={height}
                    stageNo={this.props.stageResult.stageNo}
                    roundNo={this.state.currentRound}
                    roundResult={this.props.stageResult.roundResultList[this.state.currentRound - 1]}
                    initialStatues={this.state.initialStatues}
                    initialMobs={this.state.initialMobs}
                    onFinish={this.onFinishRound} />}
                <AnimatedSprite
                    width={width}
                    height={height}
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