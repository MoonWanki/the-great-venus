import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import FlatButton from 'Components/Client/Components/FlatButton';
import Animated from 'animated';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class MenuContainer extends Component {
    render() {
        const { x, y, width, height, offset } = this.props;
        return (
            <Container x={x} y={y} width={width} height={height}>
                <AnimatedFlatButton
                    x={0}
                    y={0}
                    width={width*2/3 - 10}
                    height={height*2/3 - 10}
                    alpha={offset}
                    text={'Main Event Banner\n(Click to Link)'}
                    onClick={()=>window.open('/')} />
                <AnimatedFlatButton
                    x={width*2/3}
                    y={0}
                    width={width*1/3}
                    height={height*2/3 - 10}
                    alpha={offset}
                    text={'Colosseum Leaderboard\n(Click to Colosseum)'}
                    onClick={this.props.onColosseumButtonClick} />
                <AnimatedFlatButton
                    x={0}
                    y={height*2/3}
                    width={width*2/3 - 10}
                    height={height*1/3}
                    alpha={offset}
                    text={'List of Latest Notices\n(Click to Link)'}
                    onClick={()=>window.open('/')} />
                <AnimatedFlatButton
                    x={width*2/3}
                    y={height*2/3}
                    width={width*1/3}
                    height={height*1/3}
                    alpha={offset}
                    text={'My Brief Info\n(Click to Showroom)'}
                    onClick={this.props.onShowroomButtonClick} />
            </Container>
        );
    }
}

export default MenuContainer;