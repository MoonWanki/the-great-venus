import React, { Component, Fragment } from 'react';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
// import MenuContainer from './MenuContainer';
import { connect } from 'react-redux';
import { Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';

const AnimatedSprite = Animated.createAnimatedComponent(Sprite);
const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class HomeUI extends Component {
    
    render() {
        const { offset, width, height } = this.props;
        // const menuContainerSize = { w: width*3/5, h: height*3/5 };
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] })} />
                <AnimatedSprite
                    alpha={offset}
                    texture={this.context.app.loader.resources.banner.texture}
                    anchor={[0.5, 0.5]}
                    x={this.props.width/2}
                    y={this.props.height/2} />
                {/* <MenuContainer
                    x={width/2 - menuContainerSize.w/2}
                    y={height/2 - menuContainerSize.h/2}
                    width={menuContainerSize.w}
                    height={menuContainerSize.h}
                    alpha={offset}
                    onColosseumButtonClick={this.props.onColosseumButtonClick}
                    onShowroomButtonClick={this.props.onShowroomButtonClick} /> */}
                <AnimatedFlatButton
                    x={width/2}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 60, height + this.props.contentY - 60] })}
                    alpha={offset}
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

HomeUI.contextTypes = {
    app: PropTypes.object,
}