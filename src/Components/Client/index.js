import React, { Component } from 'react';
import { Stage } from "react-pixi-fiber";
import GameIntroScreen from './GameIntroScreen';
import GameBase from './GameBase';
import Animated from 'animated';
import './index.scss';

export default class Client extends Component {

    state = {
        isGameReady: false,
        stageWidth: 0,
        stageHeight: 0,
        contentWidth: screen.width,
        contentHeight: screen.height,
        floatingFormPosition: new Animated.Value(0),
    }

    componentDidMount() {
        this.setToFullSize();
        window.onresize = () => this.setToFullSize();
        window.onpopstate = () => {
            window.location.reload();
        };
    }

    setToFullSize = () => {
        this.setState({
            stageWidth: window.innerWidth,
            stageHeight: window.innerHeight - 6
        });
    }

    onReady = () => {
        this.setState({ isGameReady: true });
        console.log("ready");
    }

    render() {
        const { stageWidth, stageHeight, contentWidth, contentHeight } = this.state;
        return (
            <div className='canvas-wrapper'>
                <Stage options={{ backgroundColor: 0x0 }} width={stageWidth} height={stageHeight} >
                    {this.state.isGameReady
                        ? <GameBase x={0} y={0} width={contentWidth} height={contentHeight} /> : null}
                    <GameIntroScreen width={contentWidth} height={contentHeight} onReady={this.onReady}/>
                </Stage>
                <FloatingForm style={{ top: this.state.floatingFormPosition.interpolate({ inputRange: [0, 1], outputRange: [-stageHeight/2, stageHeight/3]}) }} />
            </div>
        );
    }
}

const FloatingForm = Animated.createAnimatedComponent(({style})=>
    <div className='floating-from-wrapper' style={style}>
        <h5>당신은 누구인가요?</h5>
    </div>
);