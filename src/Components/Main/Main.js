import React, { Component } from 'react';
import { Stage, Text } from "react-pixi-fiber";
import RotatingJamlee from './RotatingJamlee';

const OPTIONS = {
    backgroundColor: 0x0,
};

class Main extends Component {

    state = {
        w: window.innerWidth-8,
        h: window.innerHeight-8
    }

    componentDidMount() {
        window.onresize = () => {
            this.setState({
                w: window.innerWidth-8,
                h: window.innerHeight-8
            })
        }
    }

    render() {
        const { w, h } = this.state;
        return (
            <Stage options={OPTIONS} width={this.state.w} height={this.state.h} >
                <RotatingJamlee x={w/2} y={h/2} width={700} height={700} />
            </Stage>
        );
    }
}

export default Main;