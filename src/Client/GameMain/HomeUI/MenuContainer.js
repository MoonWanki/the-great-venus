import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

class MenuContainer extends Component {
    render() {
        return (
            <Container {...this.props}>
                <Sprite
                    texture={PIXI.Texture.fromImage(require('images/banner.png'))}
                    anchor={[0.5, 0.5]}
                    x={this.props.width/2}
                    y={this.props.height/2} />
            </Container>
        );
    }
}

export default MenuContainer;