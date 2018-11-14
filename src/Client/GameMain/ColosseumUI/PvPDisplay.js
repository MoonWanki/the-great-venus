import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';
import Animated from 'animated';
import Field from 'Client/Components/Field';
import { connect } from 'react-redux';
import Background from 'Client/Components/Background';
import Modal from 'Client/Components/Modal';
import * as userActions from 'store/modules/userModule';
import { bindActionCreators } from 'redux';

const loadingScreenFadeDuration = 1000;

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);

class PvPDisplay extends Component {

    state = {
        loadingScreenOffset: new Animated.Value(1),
        fieldOn: false,
        victoryModalOn: false,
        defeatedModalOn: false,
    }

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    componentDidMount = async () => {
        await this.sleep(1000);
        this.setState({ fieldOn: true });
        this.dismissLoadingScreen();
    }

    dismissLoadingScreen = () => {
        Animated.timing(this.state.loadingScreenOffset, { toValue: 0, duration: loadingScreenFadeDuration }).start();
    }

    onFinishBattle = () => {
        if(this.props.PvPResult.victory) {
            this.setState({ victoryModalOn: true });
        } else {
            this.setState({ defeatedModalOn: true });
        }
    }

    render() {
        const { width, height } = this.props;
        return (
            <Container alpha={this.props.offset} width={width} height={height}>
                {this.state.fieldOn && <Background
                    theme={`stage_field1_1`}
                    width={width}
                    height={height}
                    offsetX={0}
                    offsetY={0} />}
                {this.state.fieldOn && <Field
                    isColosseum
                    width={width}
                    height={height}
                    data={this.props.PvPResult}
                    enemyData={this.props.enemyData}
                    onFinish={this.onFinishBattle} />}
                {this.state.victoryModalOn && <Modal
                    text={`승리!`}
                    width={500}
                    height={300}
                    buttonText={'확인'}
                    offset={1}
                    onDismiss={() => {
                        this.setState({ victoryModalOn: false });
                        this.props.onFinish();
                    }} />}
                {this.state.defeatedModalOn && <Modal
                    text={`패배하였습니다.`}
                    width={500}
                    height={300}
                    buttonText={'확인'}
                    offset={1}
                    onDismiss={() => {
                        this.setState({ defeatedModalOn: false });
                        this.props.onFinish();
                    }} />}
                <AnimatedSprite
                    width={width}
                    height={height}
                    alpha={this.state.loadingScreenOffset}
                    texture={this.context.app.loader.resources.pvp_loading_screen.texture} />
            </Container>
        );
    }
}

PvPDisplay.contextTypes = {
    app: PropTypes.object,
};

export default connect(
    state => ({
        TGV: state.web3Module.TGV,
        userData: state.userModule.userData,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
    })
)(PvPDisplay);