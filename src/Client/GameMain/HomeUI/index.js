import React, { Component, Fragment } from 'react';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import MenuContainer from './MenuContainer';
import { connect } from 'react-redux';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class HomeUI extends Component {
    
    render() {
        const { offset, width, height } = this.props;
        const menuContainerSize = { w: width*3/5, h: height*3/5 };
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] })} />
                <MenuContainer
                    x={width/2 - menuContainerSize.w/2}
                    y={height/2 - menuContainerSize.h/2}
                    width={menuContainerSize.w}
                    height={menuContainerSize.h}
                    offset={offset}
                    onColosseumButtonClick={this.props.onColosseumButtonClick}
                    onShowroomButtonClick={this.props.onShowroomButtonClick} />
                <AnimatedFlatButton
                    x={width + this.props.contentX - 280}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY, height + this.props.contentY - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'GO'}
                    onClick={this.props.onShowroomButtonClick} />
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
)(HomeUI);