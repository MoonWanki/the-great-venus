import React, { Component } from 'react';
import Box from './Box';
import { Container } from 'react-pixi-fiber';

export default class PercentageBar extends Component {

    render() {
        const percentage = this.props.value/this.props.maxValue;
        return (
            <Container
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height}>
                <Box color={0x0} alpha={0.8} width={this.props.width} height={this.props.height} />
                <Box color={this.props.color} x={1} y={1} width={(this.props.width - 2)*percentage} height={this.props.height - 2} />
            </Container>
        );
    }
}