import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import MyStatueList from './MyStatueList';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class ShowroomUI extends Component {

    render() {
        const { offset, stageWidth, stageHeight, contentHeight } = this.props;
        return (
            <Fragment>
                <MyStatueList
                    alpha={offset}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    highlightedStatue={this.props.highlightedStatue}
                    onStatueHighlighted={this.props.onStatueHighlighted}
                    onForgeButtonClick={this.props.onForgeButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth/2 - 90}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [-36, 50] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'HOME'}
                    onClick={this.props.onHomeButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth/2 - 90}
                    y={contentHeight*3/5}
                    alpha={offset}
                    width={200}
                    height={160}
                    text={'SPECIFICATION'}
                    onClick={this.props.onForgeButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth - 600}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={'SELECT STAGE'}
                    onClick={this.props.onStageSelectButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth - 300}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={'ENTER COLOSSEUM'}
                    onClick={this.props.onColosseumButtonClick} />
            </Fragment>
        );
    }
}

export default ShowroomUI;