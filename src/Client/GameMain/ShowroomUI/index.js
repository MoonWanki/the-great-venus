import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import StatueDisplayRoller from './StatueDisplayRoller';
import Easing from 'animated/lib/Easing';
import StatueSpecView from './StatueSpecView';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const statueDisplayRollerEasing = Easing.bezier(0.1, 0.8, 0.3, 1);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStatueDisplayRoller = Animated.createAnimatedComponent(StatueDisplayRoller);

class ShowroomUI extends Component {

    state = {
        statueDisplayRollerOffset: new Animated.Value(this.props.currentSelectedStatue),
    }

    onClickStatue = no => {
        if(no === this.props.currentSelectedStatue && no < this.props.userData.numStatues) {
            this.props.onForgeButtonClick();
        } else {
            this.props.onClickStatue(no);
            Animated.timing(this.state.statueDisplayRollerOffset, { toValue: no, easing: statueDisplayRollerEasing }).start();
        }
    }

    onMousewheel = (dir) => {
        if(dir === -1 && this.props.currentSelectedStatue > 0) this.onClickStatue(this.props.currentSelectedStatue - 1);
        else if(dir === 1 && this.props.currentSelectedStatue < this.props.gameData.maxStatue) this.onClickStatue(this.props.currentSelectedStatue + 1);
    }

    render() {
        const { offset, width, height } = this.props;
        const gapBetweenStatues = width/3;

        return (
            <Fragment>
                <AnimatedStatueDisplayRoller
                    x={this.state.statueDisplayRollerOffset.interpolate({ inputRange: [0, this.props.gameData.maxStatue], outputRange: [0, -this.props.gameData.maxStatue*gapBetweenStatues] })}
                    y={this.props.backgroundOffset.interpolate({ inputRange: [-1, 1], outputRange: [-height, height]})}
                    width={width}
                    height={height*13/20}
                    alpha={this.props.offset}
                    gapBetweenStatues={gapBetweenStatues}
                    onMousewheel={this.onMousewheel}
                    onClickStatue={this.onClickStatue} />
                <StatueSpecView
                    x={width/2}
                    y={height*31/40}
                    currentSelectedStatue={this.props.currentSelectedStatue}
                    onClick={this.props.onForgeButtonClick} />
                <AnimatedFlatButton
                    x={width/2}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [-this.props.contentY - 50, -this.props.contentY + 50] })}
                    alpha={offset}
                    text={'로비로 가기'}
                    onClick={this.props.onHomeButtonClick} />
                <AnimatedFlatButton
                    x={-this.props.contentX + 150}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 100, height + this.props.contentY - 100] })}
                    alpha={offset}
                    text={'뷰티 샵'}
                    onClick={()=>window.Materialize.toast("준비 중입니다.", 1500)} />
                <AnimatedFlatButton
                    texture={[this.context.app.loader.resources.btn_start.texture, this.context.app.loader.resources.btn_start_hover.texture]}
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [width + this.props.contentX + 220, width + this.props.contentX - 220] })}
                    y={height + this.props.contentY - 200}
                    alpha={offset}
                    onClick={this.props.onStageSelectButtonClick} />
                <AnimatedFlatButton
                    texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long_hover.texture]}
                    x={offset.interpolate({ inputRange: [0, 1], outputRange: [width + this.props.contentX + 220, width + this.props.contentX - 220] })}
                    y={height + this.props.contentY - 70}
                    alpha={offset}
                    text={'지하 투기장'}
                    onClick={this.props.onColosseumButtonClick} />
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
)(ShowroomUI);

ShowroomUI.contextTypes = {
    app: PropTypes.object,
}