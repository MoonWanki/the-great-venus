import React, { Component } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';
import * as PIXI from 'pixi.js';

const AnimatedBox = Animated.createAnimatedComponent(Box);
//const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedContainer = Animated.createAnimatedComponent(Container);

class Modal extends Component {

    componentDidMount = () => {
        window.onkeydown = e => {
            if(e.keyCode === 27) {
                this.props.onDismiss();
            }
        }
    }

    componentWillUnmount = () => {
        window.onkeydown = null;
    }
    
    render() {
        return (
            <AnimatedContainer interactive width={this.props.contentWidth} height={this.props.contentHeight} alpha={this.props.offset || 1}>
                <AnimatedBox
                    width={this.props.contentWidth}
                    height={this.props.contentHeight}
                    alpha={0.5} />
                <Container
                    x={this.props.contentWidth/2}
                    y={this.props.contentHeight/2}>
                    <Sprite
                        anchor={[0.5, 0.5]}
                        texture={PIXI.Texture.fromImage(require('images/ui/modal.png'))} />
                    <Text
                        anchor={[0.5, 0.5]}
                        text={this.props.text}
                        style={{ fill: 0xffffff, fontSize: 18, align: 'center', fontFamily: 'Noto Sans KR', leading: 3 }} />
                    <FlatButton
                        y={140}
                        text={this.props.buttonText}
                        onClick={this.props.onDismiss} />
                </Container>
            </AnimatedContainer>
        );
    }
}

export default connect(
    state => ({
        contentWidth: state.canvasModule.contentWidth,
        contentHeight: state.canvasModule.contentHeight,
    }),
)(Modal);