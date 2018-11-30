import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import StatueSelector from './StatueSelector';
import EquipDisplayContainer from './EquipDisplayContainer';
import { connect } from 'react-redux';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStatueSelector = Animated.createAnimatedComponent(StatueSelector);
const AnimatedEquipDisplayContainer = Animated.createAnimatedComponent(EquipDisplayContainer);

class ForgeUI extends Component {

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                <AnimatedStatueSelector
                    x={width/2 - 600}
                    y={height/2 - 250}
                    width={340}
                    height={500}
                    alpha={offset}
                    currentSelectedStatue={this.props.currentSelectedStatue}
                    onClickStatue={this.props.onClickStatue} />
                <AnimatedEquipDisplayContainer
                    x={width/2 - 240}
                    y={height/2 - 250}
                    width={840}
                    height={500}
                    alpha={offset}
                    currentSelectedStatue={this.props.currentSelectedStatue} />
                <AnimatedFlatButton
                    x={width + this.props.contentX - 150}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 60, height + this.props.contentY - 60] })}
                    alpha={offset}
                    text={'DONE'}
                    onClick={this.props.onBackButtonClick} />
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
)(ForgeUI);