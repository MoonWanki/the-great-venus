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
                interactive={!this.props.disabled}
                cursor='pointer'
                click={this.props.onClick}
                mouseover={this.props.disabled ? null : ()=>this.setState({ hover: true })}
                mouseout={this.props.disabled ? null : ()=>this.setState({ hover: false })}
                mousedown={this.props.disabled ? null : ()=>this.setState({ hover: false })}
                mouseup={this.props.disabled ? null : ()=>this.setState({ hover: true })}
                {...this.props}>
                <Sprite
                    tint={this.props.disabled ? 0x808080 : 0xFFFFFF}
                    anchor={[0.5, 0.5]}
                    texture={this.state.hover ? buttonTextures[1] : buttonTextures[0]} />
                <Text
                    anchor={[0.5, 0.5]}
                    tint={this.props.disabled ? 0xA0A0A0 : 0xFFFFFF}
                    position={this.props.textPosition || [0, 0]}
                    text={this.props.text}
                    style={this.props.textStyle || { fill: 0xffffff, fontSize: 17, align: 'center', fontStyle: 'bold', fontFamily: 'Noto Sans KR' }} />
            </Container>
        );
    }
}