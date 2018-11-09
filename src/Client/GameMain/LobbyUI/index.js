import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import ProfileContainer from './ProfileContainer';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedProfileContainer = Animated.createAnimatedComponent(ProfileContainer);

class LobbyUI extends Component {

    render() {
        const { offset, stageWidth, contentWidth } = this.props;
        const profileContainerSize = { w: contentWidth/6, h: contentWidth/20 }
        return (
            <Fragment>
                <AnimatedFlatButton
                    x={stageWidth-200}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [-30, 50] })}
                    alpha={1}
                    width={100}
                    height={30}
                    text={'SETTING'}
                    onClick={this.props.onSettingButtonClick} />
                <AnimatedProfileContainer
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [-profileContainerSize.w, 0] })}
                    y={0}
                    width={profileContainerSize.w}
                    height={profileContainerSize.h} />
            </Fragment>
        );
    }
}

export default LobbyUI;