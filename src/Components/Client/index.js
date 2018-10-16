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
                        ? <GameBase
                            stageWidth={stageWidth}
                            stageHeight={stageHeight}
                            contentWidth={contentWidth}
                            contentHeight={contentHeight} />
                        : null}
                    <GameIntroScreen width={stageWidth} height={stageHeight} onReady={this.onReady}/>
                </Stage>
            </div>
        );
    }
}