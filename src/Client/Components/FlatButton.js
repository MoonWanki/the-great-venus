import React, { Component } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import btn from 'images/ui/btn.png';
import btn_hover from 'images/ui/btn_hover.png';

export default class FlatButton extends Component {

    state = {
        hover: false,
    }

    render() {
        const buttonTextures = this.props.texture || [PIXI.Texture.fromImage(btn), PIXI.Texture.fromImage(btn_hover)];
        return (
            <Container
                interactive
                cursor='pointer'
                click={this.props.onClick}
                mouseover={()=>this.setState({ hover: true })}
                mouseout={()=>this.setState({ hover: false })}
                mousedown={()=>this.setState({ hover: false })}
                mouseup={()=>this.setState({ hover: true })}
                {...this.props}>
                <Sprite
                    anchor={[0.5, 0.5]}
                    texture={this.state.hover ? buttonTextures[1] : buttonTextures[0]}
                    position={[this.props.width/2, this.props.height/2]} />
                <Text
                    anchor={[0.5, 0.5]}
                    position={[this.props.width/2, this.props.height/2]}
                    text={this.props.text}
                    style={{ fill: 0xffffff, fontSize: 18, align: 'center', fontStyle: 'bold', fontFamily: ['Noto Sans KR', 'sans-serif'] }} />
            </Container>
        );
    }
}