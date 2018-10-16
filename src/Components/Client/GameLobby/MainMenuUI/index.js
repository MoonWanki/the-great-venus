import React, { Component, Fragment } from 'react';
import Box from 'Components/Client/Box';
import Animated from 'animated';
import MyStatueList from './MyStatueList';
import FlatButton from '../../FlatButton';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class MainMenuUI extends Component {
    
    render() {
        const { offset, stageWidth, stageHeight } = this.props;
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <MyStatueList
                    alpha={offset}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    onStatueClick={this.props.onStatueClick} />
                <AnimatedFlatButton
                    x={100}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 50] })}
                    alpha={offset}
                    width={150}
                    height={36}
                    text={'COLOSSEUM'}
                    onClick={this.props.onColosseumButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth - 280}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'SELECT STAGE'}
                    onClick={this.props.onGoButtonClick} />
            </Fragment>
        );
    }
}

export default MainMenuUI;