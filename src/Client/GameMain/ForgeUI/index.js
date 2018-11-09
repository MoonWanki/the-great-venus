import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import StatueSelector from './StatueSelector';
import EquipDisplayContainer from './EquipDisplayContainer';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class ForgeUI extends Component {

    render() {
        const { offset, stageWidth, stageHeight, contentWidth, contentHeight } = this.props;
        return (
            <Fragment>
                <StatueSelector
                    x={contentWidth/8}
                    y={contentHeight/8}
                    width={contentWidth/5}
                    height={contentHeight*5/8}
                    offset={1}
                    currentSelectedStatue={this.props.currentSelectedStatue}
                    onClickStatue={this.props.onClickStatue} />
                <EquipDisplayContainer
                    x={contentWidth*2/5}
                    y={contentHeight/8}
                    width={contentWidth/2}
                    height={contentHeight*5/8}
                    offset={offset}
                    currentSelectedStatue={this.props.currentSelectedStatue} />
                <AnimatedFlatButton
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [stageWidth, stageWidth - 280] })}
                    y={stageHeight - 86}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'DONE'}
                    onClick={this.props.onBackButtonClick} />
            </Fragment>
        );
    }
}

export default ForgeUI;