import React, { Component, Fragment } from 'react';
import Box from 'Components/Client/Box';
import Animated from 'animated';
import MyStatueList from './MyStatueList';
import ColosseumButton from './ColosseumButton';
import GoButton from './GoButton';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);

class MainMenuUI extends Component {
    
    render() {
        const { width, height, offset } = this.props;
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <ColosseumButton
                    click={this.props.onColosseumButtonClick}
                    width={140}
                    height={30} />
                <MyStatueList
                    alpha={offset}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    onStatueClick={this.props.onStatueClick} />
                <GoButton
                    x={window.innerWidth}
                    y={window.innerHeight}
                    click={this.props.onGoButtonClick} />
            </Fragment>
        );
    }
}

export default MainMenuUI;