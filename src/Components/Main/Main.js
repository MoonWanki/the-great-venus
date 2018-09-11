import React, { Component } from 'react';
import { Stage } from "react-pixi-fiber";
import RotatingJamlee from './RotatingJamlee';

const width = 1920;
const height = 1080;
const OPTIONS = {
    backgroundColor: 0x1099bb
};

class Main extends Component {

    render() {
        return (
            <Stage options={OPTIONS} width={width} height={height}>
                <RotatingJamlee x={960} y={540} width={1000} height={1000} />
            </Stage>
        );
    }
}

export default Main;