import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import StatueDisplayRoller from './StatueDisplayRoller';
import Easing from 'animated/lib/Easing';
import StatueSpecView from './StatueSpecView';
import { connect } from 'react-redux';

const statueDisplayRollerEasing = Easing.bezier(0.1, 0.8, 0.3, 1);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStatueDisplayRoller = Animated.createAnimatedComponent(StatueDisplayRoller);

class ShowroomUI extends Component {

    state = {
        currentSelectedStatue: this.props.currentSelectedStatue,
        statueDisplayRollerOffset: new Animated.Value(0),
    }

    onClickStatue = (no) => {
        this.setState({ currentSelectedStatue: no });
        this.props.onClickStatue(no);
        Animated.timing(this.state.statueDisplayRollerOffset, { toValue: no, easing: statueDisplayRollerEasing }).start();
    }

    onMousewheel = (dir) => {
        if(dir === -1 && this.state.currentSelectedStatue > 0) this.onClickStatue(this.state.currentSelectedStatue - 1);
        else if(dir === 1 && this.state.currentSelectedStatue < this.props.gameData.maxStatue) this.onClickStatue(this.state.currentSelectedStatue + 1);
    }

    render() {
        const { offset, stageWidth, stageHeight, contentWidth, contentHeight } = this.props;
        const gapBetweenStatues = contentWidth/3;

        return (
            <Fragment>
                <AnimatedStatueDisplayRoller
                    x={this.state.statueDisplayRollerOffset.interpolate({ inputRange: [0, this.props.gameData.maxStatue], outputRange: [0, -this.props.gameData.maxStatue*gapBetweenStatues] })}
                    y={this.props.backgroundOffset.interpolate({ inputRange: [-1, 1], outputRange: [-contentHeight, contentHeight]})}
                    width={contentWidth}
                    height={contentHeight*3/5}
                    alpha={this.props.offset}
                    maxStatue={this.props.gameData.maxStatue}
                    numStatues={this.props.userData.numStatues}
                    defaultStatueLook={this.props.userData.defaultStatueLook}
                    gapBetweenStatues={gapBetweenStatues}
                    onMousewheel={this.onMousewheel}
                    onClick={this.onClickStatue} />
                <StatueSpecView
                    x={contentWidth/2 - 100}
                    y={contentHeight*3/5}
                    alpha={1}
                    width={200}
                    height={180}
                    currentSelectedStatue={this.state.currentSelectedStatue}
                    onClick={this.props.onForgeButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth/2 - 90}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [-36, 50] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'HOME'}
                    onClick={this.props.onHomeButtonClick} />
                <AnimatedFlatButton
                    x={100}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={"BLACKSMITH'S HOUSE"}
                    onClick={this.props.onForgeButtonClick} />
                <AnimatedFlatButton
                    x={400}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={'BEAUTY SHOP'}
                    onClick={()=>window.Materialize.toast("준비 중입니다.", 1500)} />
                <AnimatedFlatButton
                    x={stageWidth - 600}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={'SELECT STAGE'}
                    onClick={this.props.onStageSelectButtonClick} />
                <AnimatedFlatButton
                    x={stageWidth - 300}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 100] })}
                    alpha={offset}
                    width={280}
                    height={60}
                    text={'ENTER COLOSSEUM'}
                    onClick={this.props.onColosseumButtonClick} />
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
    }),
)(ShowroomUI);