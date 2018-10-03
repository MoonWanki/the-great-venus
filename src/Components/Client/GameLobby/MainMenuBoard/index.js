import React, { Component, Fragment } from 'react';
import Box from 'Components/Client/Box';
import Animated from 'animated';
import MyStatueList from './MyStatueList';
import Navbar from './Navbar';
import Background from './Background';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);

class MainMenuBoard extends Component {
    
    render() {
        const { width, height, offset } = this.props;
        return (
            <Fragment>
                <Background
                    theme={0}
                    width={width}
                    height={height} />
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <Navbar
                    x={100}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [-60, 20] })}
                    width={140}
                    height={30} />
                <MyStatueList
                    alpha={offset}
                    x={0}
                    y={0}
                    width={width}
                    height={height} />
            </Fragment>
        );
    }
}

export default MainMenuBoard;