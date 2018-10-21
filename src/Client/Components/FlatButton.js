import React, { Component } from 'react';
import Box from './Box';
import { Container, Text } from 'react-pixi-fiber';

export default class FlatButton extends Component {

    state = {
        hover: false,
    }

    render() {
        return (
            <Container
                interactive
                cursor='pointer'
                click={this.props.onClick}
                mouseover={()=>this.setState({ hover: true })}
                mouseout={()=>this.setState({ hover: false })}
                {...this.props}>
                <Box color={this.state.hover ? 0x242424 : 0x0} alpha={0.8} x={0} y={0} width={this.props.width} height={this.props.height} />
                <Text
                    anchor={[0.5, 0.5]}
                    position={[this.props.width/2, this.props.height/2]}
                    text={this.props.text}
                    style={{ fill: 0xffffff, fontSize: 16 }} />
            </Container>
        );
    }
}