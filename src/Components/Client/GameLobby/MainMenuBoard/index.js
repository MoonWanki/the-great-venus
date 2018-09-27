import React, { Component, Fragment } from 'react';
import Box from 'Components/Client/Box';
import Animated from 'animated';
import StatueList from './StatueList';
import Navbar from './Navbar';
import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import Background from './Background';

const AnimatedBox = Animated.createAnimatedComponent(Box);

class MainMenuBoard extends Component {
    
    render() {
        return (
            <Fragment>
                <Background
                    theme={0}
                    width={this.props.width}
                    height={this.props.height} />
                <AnimatedBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={this.props.width}
                    height={this.props.height}
                    alpha={this.props.offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <Navbar
                    x={100}
                    y={this.props.offset.interpolate({ inputRange: [0, 1], outputRange: [-60, 20] })}
                    width={120}
                    height={40} />
                <StatueList alpha={this.props.offset} />
                <GoToStageButton />
            </Fragment>
        );
    }
}

const GoToStageButton = CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, { color, x, y, width, height, alpha }) => {
        if (typeof oldProps !== 'undefined') {
            instance.clear();
        }
        instance.beginFill(color);
        instance.drawRect(x, y, width, height);
        instance.endFill();
        instance.alpha = alpha;
    },
}, 'BlackBox');

export default MainMenuBoard;