import React, { Component, Fragment } from 'react';
import Animated from 'animated';
import ProfileContainer from './ProfileContainer';
import { connect } from 'react-redux';

const AnimatedProfileContainer = Animated.createAnimatedComponent(ProfileContainer);

class LobbyUI extends Component {

    render() {
        const { offset, width } = this.props;
        const profileContainerSize = { w: width/6, h: width/20 }
        return (
            <Fragment>
                <AnimatedProfileContainer
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [-this.props.contentX - profileContainerSize.w, -this.props.contentX] })}
                    y={-this.props.contentY}
                    width={profileContainerSize.w}
                    height={profileContainerSize.h} />
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    })
)(LobbyUI);