import React, { Component, Fragment } from 'react';
import Box from './Box';
import Animated from 'animated';
import StatueList from './StatueList';
import GameMainMenuNavbar from './GameMainMenuNavbar';
import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

const AnimatedBox = Animated.createAnimatedComponent(Box);

class GameMainMenuBoard extends Component {
    
    render() {
        return (
            <Fragment>
                <AnimatedBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={this.props.width}
                    height={this.props.height}
                    alpha={this.props.offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <GameMainMenuNavbar />
                <StatueList />
                <GoToStageButton />
            </Fragment>
        );
    }
}

const GoToStageButton = CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, { color, x, y, width, height, alpha }) => {
        if (typeof oldProps !== "undefined") {
            instance.clear();
        }
        instance.beginFill(color);
        instance.drawRect(x, y, width, height);
        instance.endFill();
        instance.alpha = alpha;
    },
}, 'BlackBox');

export default GameMainMenuBoard;