import React, { Component, Fragment } from 'react';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { Container } from 'react-pixi-fiber';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class SignUpUI extends Component {

    state = {
        name: '',
    }

    componentDidMount = () => {
        
    }
    
    render() {
        const { offset, stageWidth, stageHeight, contentWidth, contentHeight } = this.props;
        const boxSize = { w: contentWidth*3/5, h: contentHeight*3/5 };
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <Container
                    x={stageWidth/2 - boxSize.w/2}
                    y={stageHeight/2 - boxSize.h/2}
                    width={boxSize.w}
                    height={boxSize.h}
                    offset={offset}
                    onColosseumButtonClick={this.props.onColosseumButtonClick}
                    onShowroomButtonClick={this.props.onShowroomButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth - 280}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'GO'}
                    onClick={this.props.onShowroomButtonClick} />
            </Fragment>
        );
    }
}

export default SignUpUI;