import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class ForgeUI extends Component {

    render() {
        const { offset, stageWidth, stageHeight } = this.props;
        return (
            <Fragment>
                <AnimatedFlatButton
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [stageWidth, stageWidth - 280] })}
                    y={stageHeight - 86}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'BACK TO SHOWROOM'}
                    onClick={this.props.onBackButtonClick} />
            </Fragment>
        );
    }
}

export default ForgeUI;