import React, { Component } from 'react';
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import PropTypes from "prop-types";
import crew2 from 'images/crew_jamlee.jpg';

export default class RotatingJamlee extends Component {

    state = {
        rotation: 1,
        v: 0.01
    }

    componentDidMount() {
        this.context.app.ticker.add(this.animate);
    }

    
    componentWillUnmount() {
        this.context.app.ticker.remove(this.animate);
    }

    animate = delta => {
        this.setState(state => ({
            ...state,
            rotation: state.rotation + state.v,
        }));
    };

    render() {
        return (
            <Sprite
                rotation={this.state.rotation}
                anchor={new PIXI.Point(0.5, 0.5)}
                texture={PIXI.Texture.fromImage(crew2)}
                {...this.props}
            />
        )
    }
}

RotatingJamlee.contextTypes = {
    app: PropTypes.object
  };