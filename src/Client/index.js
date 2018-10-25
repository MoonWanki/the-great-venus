import React, { Component } from 'react';
import { connect } from 'react-redux';
import Animated from 'animated';
import GameBase from './GameBase';
import { Stage } from 'react-pixi-fiber';
import { Helmet } from 'react-helmet';
import './index.scss';

class Client extends Component {

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

    render() {
        return (
            <div className='canvas-wrapper'>
                <Helmet>
                    <title>TGV Client</title>
                    <meta name="description" content="The Great Venus game client" />
                </Helmet>
                <Stage options={{ backgroundColor: 0x0 }} width={this.state.stageWidth} height={this.state.stageHeight}>
                    <GameBase
                        stageWidth={this.state.stageWidth}
                        stageHeight={this.state.stageHeight}
                        contentWidth={this.state.contentWidth}
                        contentHeight={this.state.contentHeight} />
                </Stage>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
    }),
)(Client);