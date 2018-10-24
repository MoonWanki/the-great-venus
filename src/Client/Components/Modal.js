import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
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
        const { offset, stageWidth, stageHeight } = this.props;
        return (
            <AnimatedContainer interactive width={stageWidth} height={stageHeight} alpha={offset}>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    alpha={0.5} />
                <Container
                    x={stageWidth/2 - this.props.width/2}
                    y={stageHeight/2 - this.props.height/2}
                    width={this.props.width}
                    height={this.props.height}>
                    <Box
                        color={0x0}
                        alpha={0.8}
                        width={this.props.width}
                        height={this.props.height} />
                    <Text
                        anchor={[0.5, 0.5]}
                        position={[this.props.width/2, this.props.height/2]}
                        text={this.props.text}
                        style={{ fill: 0xffffff, fontSize: 16 }} />
                    <FlatButton
                        x={this.props.width/2 - 50}
                        y={this.props.height - 50}
                        width={100}
                        height={36}
                        text={this.props.buttonText}
                        onClick={this.props.onDismiss} />
                </Container>
            </AnimatedContainer>
        );
    }
}

export default Modal;