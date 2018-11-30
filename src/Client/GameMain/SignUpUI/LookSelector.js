import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import FlatButton from 'Client/Components/FlatButton';
import Box from 'Client/Components/Box';
import Animated from 'animated';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

const textStyle = {
    fill: 0xffffff,
    fontSize: 16,
    align: 'center',
    fontStyle: 'bold',
    fontFamily: ['Noto Sans KR', 'sans-serif'],
}

class LookSelector extends Component {
    render() {
        const { x, y, width, height, offset } = this.props;
        return (
            <Container x={x} y={y} width={width} height={height} alpha={offset}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.3}
                    borderColor={0xc0c0c0} />
                <Text text={'스타일을 설정해주세요!'} anchor={[0.5, 0]} x={width/2} y={20} style={{ ...textStyle, fontSize: 20 }} />
                <Text text={'헤어스타일'} anchor={[0.5, 0]} x={width*1/6} y={80} style={textStyle} />
                {['더벅머리', '단발머리', '까까머리', '모히칸', '뽀글머리'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={width*1/6}
                    y={140 + 64*i}
                    text={name}
                    onClick={()=>this.props.onChange('hair', i)} />
                )}
                <Text text={'눈'} anchor={[0.5, 0]} x={width/2} y={80} style={textStyle} />
                {['정교한 눈', '각진 눈', '시크한 눈', '매서운 눈'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={width/2}
                    y={140 + 64*i}
                    text={name}
                    onClick={()=>this.props.onChange('eye', i)} />
                )}
                <Text text={'피부색'} anchor={[0.5, 0]} x={width*5/6} y={80} style={textStyle} />
                {['연한 회색', '회색', '짙은 회색'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={width*5/6}
                    y={140 + 64*i}
                    text={name}
                    onClick={()=>this.props.onChange('skin', i)} />
                )}
            </Container>
        );
    }
}

export default LookSelector;