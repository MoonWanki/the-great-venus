import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedContainer = Animated.createAnimatedComponent(Container);

const settingBoxSize = {w: 400, h: 500};

class SettingUI extends Component {
    
    render() {
        const { offset, width, height } = this.props;
        return (
            <Container interactive width={width} height={height} click={this.props.onDismiss}>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <AnimatedContainer interactive click={()=>console.log('ff')} width={settingBoxSize.w}
                        height={settingBoxSize.h} alpha={offset}>
                    <AnimatedBlackBox
                        color={0x0}
                        x={width/2 - settingBoxSize.w/2}
                        y={height/2 - settingBoxSize.h/2}
                        alpha={offset}
                        width={settingBoxSize.w}
                        height={settingBoxSize.h} />
                    <AnimatedFlatButton
                        x={width/2 - 50}
                        y={height/2 + settingBoxSize.h/2 - 36 - 10}
                        width={100}
                        height={36}
                        text={'CLOSE'}
                        onClick={this.props.onDismiss} />
                </AnimatedContainer>
            </Container>
        );
    }
}

export default SettingUI;