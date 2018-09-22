import React, { Component } from 'react';
import { Stage } from "react-pixi-fiber";
import GameIntroScreen from './GameIntroScreen';
import GameMain from './GameMain';

export default class Client extends Component {

    state = {
        isGameReady: false,
        width: window.innerWidth,
        height: window.innerHeight-6,
    }

    componentDidMount() {
        window.onresize = () => {
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight-6
            })
        }
    }

    onReady = () => {
        this.setState({ isGameReady: true });
        console.log("ready");
    }

    render() {
        const { width, height } = this.state;
        return (
            <div style={{ background: 'black', overflow: 'hidden'}}>
                <Stage options={{ backgroundColor: 0x0 }} width={width} height={height} >
                    {this.state.isGameReady ? <GameMain /> : null}
                    <GameIntroScreen width={width} height={height} onReady={this.onReady}/>
                </Stage>
            </div>
        );
    }
}