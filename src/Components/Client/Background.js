import React, { Component } from 'react';
import { Container, TilingSprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import Animated from 'animated';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTilingSprite = Animated.createAnimatedComponent(TilingSprite);

class Background extends Component {

    state = {
        themes: {
            'main1': [
                { src: this.context.app.loader.resources.bg_main1_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_main1_2, speed: 1 },
                { src: this.context.app.loader.resources.bg_main1_3, speed: 1.5 },
                { src: this.context.app.loader.resources.bg_main1_4, speed: 0 },
                { src: this.context.app.loader.resources.bg_main1_5, speed: 2 },
                { src: this.context.app.loader.resources.bg_main1_6, speed: 0 },
                { src: this.context.app.loader.resources.bg_main1_7, speed: 2.5 },
            ],
            'main2': [
                { src: this.context.app.loader.resources.bg_main2_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_main2_2, speed: 0 },
                { src: this.context.app.loader.resources.bg_main2_3, speed: 0 },
                { src: this.context.app.loader.resources.bg_main2_4, speed: 0 },
                { src: this.context.app.loader.resources.bg_main2_5, speed: 0 },
                { src: this.context.app.loader.resources.bg_main2_6, speed: 1 },
                { src: this.context.app.loader.resources.bg_main2_7, speed: 1.5 },
                { src: this.context.app.loader.resources.bg_main2_8, speed: 2 },
                { src: this.context.app.loader.resources.bg_main2_9, speed: 0 },
            ],
            'main3': [
                { src: this.context.app.loader.resources.bg_main3_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_main3_2, speed: 1 },
                { src: this.context.app.loader.resources.bg_main3_3, speed: 0 },
                { src: this.context.app.loader.resources.bg_main3_4, speed: 2 },
                { src: this.context.app.loader.resources.bg_main3_5, speed: 0 },
                { src: this.context.app.loader.resources.bg_main3_6, speed: 0 },
                { src: this.context.app.loader.resources.bg_main3_7, speed: 0 },
                { src: this.context.app.loader.resources.bg_main3_8, speed: 0 },
            ],
            'main4': [
                { src: this.context.app.loader.resources.bg_main4_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_main4_2, speed: 1 },
                { src: this.context.app.loader.resources.bg_main4_3, speed: 0 },
                { src: this.context.app.loader.resources.bg_main4_4, speed: 2 },
                { src: this.context.app.loader.resources.bg_main4_5, speed: 0 },
            ],
            'forge': [
                { src: this.context.app.loader.resources.bg_forge1, speed: 0 },
            ],
            'stageselect1': [
                { src: this.context.app.loader.resources.bg_stageselect1_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_stageselect1_2, speed: 1 },
                { src: this.context.app.loader.resources.bg_stageselect1_3, speed: 0 },
            ],
            'field1_1': [
                { src: this.context.app.loader.resources.bg_field1_1_1, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_2, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_3, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_4, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_5, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_6, speed: 0 },
                { src: this.context.app.loader.resources.bg_field1_1_7, speed: 0 },
            ],
        },
        mousePosition: new PIXI.Point(this.props.width/2, this.props.height/2),
        x: 0
    }
    
    componentDidMount() {
        this.context.app.ticker.add(this.moving);
    }

    moving = () => {
        this.setState((state) => ({ x: state.x + 0.05 }))
    }

    handleMouseMove = (event) => {
        this.setState({ mousePosition: event.data.global });
    }

    render() {

        return (
            <AnimatedContainer
                interactive
                mousemove={this.handleMouseMove}
                x={typeof this.props.offsetX === 'number'
                    ? this.props.offsetX
                    : this.props.offsetX.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-this.props.width, this.props.width]
                })}
                y={typeof this.props.offsetY === 'number'
                    ? this.props.offsetY
                    : this.props.offsetY.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-this.props.height, this.props.height]
                })} >

                {this.state.themes[this.props.theme].map(({src, speed}, i)=>
                    <AnimatedTilingSprite
                        key={i}
                        texture={src.texture}
                        width={this.props.width}
                        height={this.props.height}
                        tilePosition={[
                            (this.props.width - 1920)/2 + (this.state.mousePosition.x - this.props.width/2) * (i+1) * 0.002 + this.state.x*speed,
                            (this.props.height - 1080)/2 + (this.state.mousePosition.y - this.props.height/2) * (i+1) * 0.002
                        ]}
                         />
                )}
            </AnimatedContainer>
        );
    }
}

Background.contextTypes = {
    app: PropTypes.object,
};

export default Background;