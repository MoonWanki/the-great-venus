import React, { Component, Fragment } from 'react';
import Animated from 'animated';
import ProfileContainer from './ProfileContainer';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';

const AnimatedProfileContainer = Animated.createAnimatedComponent(ProfileContainer);

class LobbyUI extends Component {

    render() {
        const { offset, width, height } = this.props;
        const profileContainerSize = { w: width/6, h: width/18 }
        return (
            <Fragment>
                <AnimatedProfileContainer
                    x={-this.props.contentX}
                    y={-this.props.contentY}
                    alpha={offset}
                    width={profileContainerSize.w}
                    height={profileContainerSize.h} />
                <Dashboard
                    x={-this.props.contentX}
                    y={height - this.props.contentY}
                    width={500}
                    height={150} />
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