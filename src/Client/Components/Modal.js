import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';

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
        const { offset, width, height } = this.props;
        return (
            <AnimatedContainer interactive width={this.props.contentWidth} height={this.props.contentHeight} alpha={offset}>
                <AnimatedBox
                    width={this.props.contentWidth}
                    height={this.props.contentHeight}
                    alpha={0.5} />
                <Container
                    x={this.props.contentWidth/2 - width/2}
                    y={this.props.contentHeight/2 - height/2}
                    width={width}
                    height={height}>
                    <Box
                        color={0x0}
                        alpha={0.7}
                        width={width}
                        height={height} />
                    <Text
                        anchor={[0.5, 0.5]}
                        position={[width/2, height/2]}
                        text={this.props.text}
                        style={{ fill: 0xffffff, fontSize: 16, align: 'center' }} />
                    <FlatButton
                        x={width/2 - 50}
                        y={height - 50}
                        width={100}
                        height={36}
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