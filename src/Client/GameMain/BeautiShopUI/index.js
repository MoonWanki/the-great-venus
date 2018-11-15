import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class BeautiShopUI extends Component {

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                <AnimatedFlatButton
                    x={width + this.props.contentX - 260}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY, height + this.props.contentY - 80] })}
                    alpha={offset}
                    width={160}
                    height={36}
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
)(BeautiShopUI);