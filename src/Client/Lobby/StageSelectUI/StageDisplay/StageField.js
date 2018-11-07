import React, { Component } from 'react';
import { Container, Sprite } from 'react-pixi-fiber';
import Background from 'Client/Components/Background';
import Animated from 'animated';
import FlatButton from 'Client/Components/FlatButton';

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);

class StageField extends Component {

    state = {
        stageNo: this.props.stageNo,
        statues: this.props.initialStatues,
        mobs: this.props.initialMobs,
        roundResultList: this.props.roundResultList,
    }

    componentDidMount = () => {
        console.log(this.props.initialStatues, this.props.initialMobs, this.props.roundResult);
    }

    render() {
        const { stageWidth, stageHeight, contentWidth, contentHeight } = this.props;
        return (
            <Container alpha={this.props.offset}>
                <Background
                    theme='stage_field1_1'
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                    contentWidth={contentWidth}
                    contentHeight={contentHeight}
                    offsetX={0}
                    offsetY={0} />
                <FlatButton
                    x={stageWidth/2}
                    y={stageHeight/2}
                    width={180}
                    height={36}
                    text='OK'
                    onClick={this.props.onFinish} />
            </Container>
        );
    }
}

export default StageField;