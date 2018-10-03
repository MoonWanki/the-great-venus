import React, { Component } from 'react';
import Box from '../../Box';
import { Container, Text } from 'react-pixi-fiber';
import Animated from 'animated';

class Navbar extends Component {
    render() {
        return (
            <Container {...this.props}>
                <Box color={0x0} x={0} y={0} width={this.props.width} height={this.props.height} alpha={0.5}/>
                <Text text={'COLOSSEUM'} style={{ fill: 0xffffff, fontSize: 20 }} />
            </Container>
        );
    }
}

export default Animated.createAnimatedComponent(Navbar);