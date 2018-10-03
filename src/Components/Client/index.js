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
        floatingFormPosition: new Animated.Value(0),
    }

    componentDidMount() {
        this.setToFullSize();
        window.onresize = () => this.setToFullSize();
        window.onpopstate = () => {
            window.location.reload();
        };
        window.onkeydown = () => {
            console.log(this.state.floatingFormPosition._value);
            if(this.state.floatingFormPosition._value < 0.1) {
                Animated.timing(this.state.floatingFormPosition, {toValue: 1}).start();
            }
            else {
                Animated.timing(this.state.floatingFormPosition, {toValue: 0}).start();
            }
        }
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
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
        const { stageWidth, stageHeight } = this.state;
        return (
            <div className='canvas-wrapper'>
                <Stage options={{ backgroundColor: 0x0 }} width={stageWidth} height={stageHeight} >
                    {this.state.isGameReady
                        ? <GameBase x={0} y={0} width={stageWidth} height={stageHeight} /> : null}
                    <GameIntroScreen width={stageWidth} height={stageHeight} onReady={this.onReady}/>
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