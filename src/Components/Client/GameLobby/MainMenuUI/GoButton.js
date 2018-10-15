import React, { Component } from 'react'
import { Sprite } from 'react-pixi-fiber';
import GoToButtonImg from 'images/ui/btn_start.png';
import * as PIXI from 'pixi.js';

export default class GoButton extends Component {

    render() {
        return (
            <Sprite
                anchor={[0.9, 0.9]}
                cursor='pointer'
                width={256}
                height={82}
                interactive
                texture={PIXI.Texture.fromImage(GoToButtonImg)}
                {...this.props} />
        )
    }
}
