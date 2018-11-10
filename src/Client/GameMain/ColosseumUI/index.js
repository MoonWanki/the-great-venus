import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';

const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class ColosseumUI extends Component {

    render() {
        const { offset, height } = this.props;
        return (
            <Fragment>
                <AnimatedFlatButton
                    x={-this.props.contentX + 20}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY, height + this.props.contentY - 86] })}
                    alpha={offset}
                    width={200}
                    height={36}
                    text={'BACK TO SHOWROOM'}
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
)(ColosseumUI);