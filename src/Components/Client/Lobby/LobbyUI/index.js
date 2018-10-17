import React, { Component, Fragment } from 'react';
import FlatButton from 'Components/Client/Components/FlatButton';
import Animated from 'animated';
import MyInfo from './MyInfo';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class LobbyUI extends Component {

    render() {
        const { offset, stageWidth } = this.props;
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
                <MyInfo anchor={[1, 0]} width={300} height={200} x={this.props.stageWidth} y={this.props.stageHeight} />
            </Fragment>
        );
    }
}

export default LobbyUI;