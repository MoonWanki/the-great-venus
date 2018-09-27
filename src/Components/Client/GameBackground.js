import React, { Component } from 'react';
import { Sprite, Container, TilingSprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedSprite = Animated.createAnimatedComponent(Sprite);
const AnimatedTilingSprite = Animated.createAnimatedComponent(TilingSprite);

class GameBackground extends Component {

    state = {
        themes: [{
            sky: this.context.app.loader.resources.bg1_1,
            items: [
                { src: this.context.app.loader.resources.bg1_2, speed: 1 },
                { src: this.context.app.loader.resources.bg1_3, speed: 1.5 },
                { src: this.context.app.loader.resources.bg1_4, speed: 0 },
                { src: this.context.app.loader.resources.bg1_5, speed: 2 },
                { src: this.context.app.loader.resources.bg1_6, speed: 0 },
                { src: this.context.app.loader.resources.bg1_7, speed: 2.5 },
            ]
        },
        {
            sky: this.context.app.loader.resources.bg2_1,
            items: [
                { src: this.context.app.loader.resources.bg2_2, speed: 0 },
                { src: this.context.app.loader.resources.bg2_3, speed: 0 },
                { src: this.context.app.loader.resources.bg2_4, speed: 0 },
                { src: this.context.app.loader.resources.bg2_5, speed: 0 },
                { src: this.context.app.loader.resources.bg2_6, speed: 1 },
                { src: this.context.app.loader.resources.bg2_7, speed: 1.5 },
                { src: this.context.app.loader.resources.bg2_8, speed: 2 },
                { src: this.context.app.loader.resources.bg2_9, speed: 0 },
            ]
        },
        {
            sky: this.context.app.loader.resources.bg3_1,
            items: [
                { src: this.context.app.loader.resources.bg3_2, speed: 1 },
                { src: this.context.app.loader.resources.bg3_3, speed: 0 },
                { src: this.context.app.loader.resources.bg3_4, speed: 2 },
                { src: this.context.app.loader.resources.bg3_5, speed: 0 },
                { src: this.context.app.loader.resources.bg3_6, speed: 0 },
                { src: this.context.app.loader.resources.bg3_7, speed: 0 },
                { src: this.context.app.loader.resources.bg3_8, speed: 0 },
            ]
        },
        {
            sky: this.context.app.loader.resources.bg4_1,
            items: [
                { src: this.context.app.loader.resources.bg4_2, speed: 1 },
                { src: this.context.app.loader.resources.bg4_3, speed: 0 },
                { src: this.context.app.loader.resources.bg4_4, speed: 2 },
                { src: this.context.app.loader.resources.bg4_5, speed: 0 },
            ]
        }],
        skyY: new Animated.Value(0),
        mousePosition: new PIXI.Point(this.props.width/2, this.props.height/2),
        x: 0
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return { currentTheme: nextProps.theme };
    }
    
    componentDidMount() {
        this.context.app.ticker.add(this.animate);
        Animated.timing(this.state.skyY, { toValue: 1, duration: 3500, easing: Easing.bezier(0.1, 0.8, 0.3, 1) }).start();
    }

    animate = () => {
        this.setState((state) => ({ x: state.x + 0.05 }))
    }

    handleMouseMove = (event) => {
        this.setState({ mousePosition: event.data.global });
    }

    render() {
        return (
            <AnimatedContainer interactive mousemove={this.handleMouseMove}>
                <AnimatedSprite
                    texture={this.state.themes[this.props.theme].sky.texture}
                    width={this.props.width}
                    height={this.props.height*1.5}
                    y={this.state.skyY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -this.props.height/2]
                    })} />
                {this.state.themes[this.props.theme].items.map(({src, speed}, i)=>
                    <AnimatedTilingSprite
                        key={i}
                        texture={src.texture}
                        width={this.props.width}
                        height={this.props.height}
                        tilePosition={[
                            (this.state.mousePosition.x - this.props.width/2) * (i+1) * 0.002 + this.state.x*speed,
                            (this.state.mousePosition.y - this.props.height/2) * (i+1) * 0.002 - this.state.skyY._value*20*i]}
                        y={this.state.skyY.interpolate({
                            inputRange: [0, 1],
                            outputRange: [this.props.height, 0]
                        })} />
                )}
            </AnimatedContainer>
        );
    }
}

GameBackground.contextTypes = {
    app: PropTypes.object,
};

export default GameBackground;