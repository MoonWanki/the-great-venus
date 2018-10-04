import React, { Component } from 'react'
import { Sprite } from 'react-pixi-fiber';
import Agrippa from 'images/agrippa.png';
import * as PIXI from 'pixi.js';

class Statue extends Component {

    render() {
        return (
            <Sprite
                texture={PIXI.Texture.fromImage(Agrippa)}
                {...this.props} />
        )
    }
}
export default Statue;