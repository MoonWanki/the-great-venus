import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import FlatButton from 'Client/Components/FlatButton';
import Box from 'Client/Components/Box';
import Animated from 'animated';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class LookSelector extends Component {
    render() {
        const { x, y, width, height, offset } = this.props;
        return (
            <Container x={x} y={y} width={width} height={height} alpha={offset}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.3} />
                {['머리1', '머리2', '머리3', '머리4', '머리5'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={110*i + 30}
                    y={100}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.props.onChange('hair', i)} />
                )}
                {['눈1', '눈2', '눈3', '눈4'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={110*i + 30}
                    y={200}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.props.onChange('eye', i)} />
                )}
                {['연한 회색', '회색', '짙은 회색'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={110*i + 30}
                    y={300}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.props.onChange('skin', i)} />
                )}
            </Container>
        );
    }
}

export default LookSelector;