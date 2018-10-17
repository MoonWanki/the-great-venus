import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Statue from 'Components/Client/Components/Statue';
import Animated from 'animated';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedStatue = Animated.createAnimatedComponent(Statue);

class StatueSpriteRoller extends Component {

    render() {
        return (
            <AnimatedContainer {...this.props} >
                {this.props.statues.map((statue, i) => 
                    <AnimatedStatue
                        no={i}
                        interactive
                        cursor='pointer'
                        key={i}
                        x={i * this.props.width/3 + 250}
                        y={this.props.height/3}
                        anchor={[0.5, 0.5]}
                        scale={1 - 0.05* Math.abs(this.props.currentSelected - i) }
                        click={()=>this.props.onClickItem(i)} />
                )}
            </AnimatedContainer>
        );
    }
}

export default StatueSpriteRoller;