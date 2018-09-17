import React, { Component } from 'react';
import { Stage, Text } from "react-pixi-fiber";
import RotatingJamlee from './RotatingJamlee';

const width = 1920;
const height = 1080;
const OPTIONS = {
    backgroundColor: 0x1099bb
};

class Main extends Component {

    state = {
        n: 0,
        m: 5
    }

    componentDidMount() {
        setInterval(()=>
            this.setState(({ n })=>({
                n: n + 1
            }))
        , 1000);
    }

    render() {
        return (
            <Stage options={OPTIONS} width={width} height={height}>
                <RotatingJamlee x={960} y={540} width={700} height={700} />
                <Text text={this.state.n + ' ' +  this.state.m }/>
            </Stage>
        );
    }
}

export default Main;