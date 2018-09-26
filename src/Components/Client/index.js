import React, { Component } from 'react';
import { Stage } from "react-pixi-fiber";
import GameIntroScreen from './GameIntroScreen';
import GameMain from './GameMain';
import Animated from 'animated';
import './index.scss';

export default class Client extends Component {

    state = {
        isGameReady: false,
        width: 0,
        height: 0,
        floatingFormPosition: new Animated.Value(0),
    }

    componentDidMount() {
        this.setToFullSize();
        window.onresize = () => this.setToFullSize();
        window.onpopstate = () => {
            window.location.reload();
        };
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    setToFullSize = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight - 12
        });
    }

    onReady = () => {
        this.setState({ isGameReady: true });
        console.log("ready");
    }

    render() {
        const { width, height } = this.state;
        return (
            <div className='canvas-wrapper'>
                <Stage options={{ backgroundColor: 0x0 }} width={width} height={height} >
                    {this.state.isGameReady
                        ? <GameMain x={0} y={0} width={width} height={height} /> : null}
                    <GameIntroScreen width={width} height={height} onReady={this.onReady}/>
                </Stage>
                <FloatingForm style={{ top: this.state.floatingFormPosition.interpolate({ inputRange: [0, 1], outputRange: [-height/2, height/3]}) }} />
            </div>
        );
    }
}

const FloatingForm = Animated.createAnimatedComponent(({style})=>
    <div className='floating-from-wrapper' style={style}>
        <h5>당신은 누구인가요?</h5>
    </div>
);