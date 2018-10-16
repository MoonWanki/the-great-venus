import React, { Component, Fragment } from 'react';
import FlatButton from '../../FlatButton';
import Animated from 'animated';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class ForgeUI extends Component {

    render() {
        const { offset, stageWidth, stageHeight } = this.props;
        return (
            <Fragment>
                <AnimatedFlatButton
                    x={stageWidth - 280}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'BACK TO MENU'}
                    onClick={this.props.onBackButtonClick} />
            </Fragment>
        );
    }
}

export default ForgeUI;