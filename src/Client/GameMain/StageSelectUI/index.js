import React, { Component, Fragment } from 'react';
import FlatButton from '../../Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as TGVApi from 'utils/TGVApi';
import * as appActions from 'store/modules/appModule';
import StageDisplay from './StageDisplay';
import Easing from 'animated/lib/Easing';
import { Container, Text, CustomPIXIComponent } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

const stageDisplayFadeDuration = 500;
const stageDisplayFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedStageDisplay = Animated.createAnimatedComponent(StageDisplay);

const stageButtonPositions = [
    [320, 816], [432, 694], [580, 586], [670, 502], [784, 430],
    [916, 368], [1110, 348], [1270, 234], [1424, 216], [1570, 306],
    [1504, 420], [1338, 542], [1534, 538], [1744, 586], [1484, 686],

    [218, 746], [370, 700], [502, 600], [516, 478], [678, 404],
    [750, 306], [1048, 280], [1220, 286], [1376, 276], [1482, 342],
    [1540, 460], [1610, 554], [1472, 602], [1380, 656], [1522, 778],
]

const SideButton = CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, newProps) => {
        const { x, y } = newProps;
        instance.clear();
        instance.beginFill(0x0);
        instance.moveTo(x, y - 60);
        instance.lineTo(x, y + 60);
        if(newProps.reverse) instance.lineTo(x + 40, y);
        else instance.lineTo(x - 40, y);
        instance.lineTo(x, y - 60);
        instance.endFill();
        instance.alpha = 0.5;
    },
}, 'SideButton');

class StageSelectUI extends Component {

    state = {
        loadingScreenOn: false,
        loadingScreenMessage: '',
        stageDisplayOn: false,
        stageDisplayOffset: new Animated.Value(0),
        stageResult: null,
        mousePosition: new PIXI.Point(this.props.width/2, this.props.height/2),
    }

    clearStage = async (stageNo, units) => {
        try {
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '스테이지에 입장하고 있습니다. 잠시만 기다려주세요.' });
            this.props.AppActions.setPreloader(true);
            const roundResultList = await TGVApi.clearStage(this.props.TGV, stageNo, units, this.props.web3.eth.coinbase);
            this.showStageDisplay(stageNo, roundResultList);
        } catch(err) {
            console.error(err);
        } finally {
            this.setState({ loadingScreenOn: false });
            this.props.AppActions.setPreloader(false);
        }
    }

    showStageDisplay = (stageNo, roundResultList) => {
        this.setState({
            stageResult: {
                stageNo: stageNo,
                roundResultList: roundResultList,
            },
            stageDisplayOn: true,
        });
        Animated.timing(this.state.stageDisplayOffset, { toValue: 1, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
    }

    // 끝나면 이거 호출하고 까만화면 띄우면 될듯 얘가 알아서 꺼주니까
    dismissStageDisplay = async () => {
        try {
            this.props.UserActions.fetchFinney(this.props.web3);
            this.props.AppActions.setPreloader(true);
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '데이터 동기화 중입니다. 잠시만 기다려주세요.' });
            await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
        } catch (err) {
            console.error(err);
        } finally {
            Animated.timing(this.state.stageDisplayOffset, { toValue: 0, duration: stageDisplayFadeDuration, easing: stageDisplayFadeEasing }).start();
            setTimeout(()=>this.setState({
                stageDisplayOn: false,
                stageResult: null,
                loadingScreenOn: false,
            }), stageDisplayFadeDuration);
            this.props.AppActions.setPreloader(false);
        }
    }

    renderStageButtons = () => _.times(15, i => {
        const stageNo = 15*(this.props.stageSelectTheme - 1) + i + 1;
        if(stageNo <= this.props.gameData.maxStage) {
            if(stageNo <= this.props.userData.lastStage + 1)
                return <FlatButton
                    key={stageNo}
                    x={stageButtonPositions[stageNo - 1][0]*this.props.width/1920 + (this.state.mousePosition.x - this.props.width/2) * 0.002}
                    y={stageButtonPositions[stageNo - 1][1]*this.props.height/1080 + (this.state.mousePosition.y - this.props.height/2) * 0.002}
                    text={stageNo}
                    textPosition={[-2, -3]}
                    textStyle={{ fill: 0xffffff, fontSize: 24, align: 'center', fontStyle: 'bold', fontFamily: 'Noto Sans KR' }}
                    texture={[
                        this.context.app.loader.resources[`btn_stageselect_${this.props.stageSelectTheme}`].texture,
                        this.context.app.loader.resources[`btn_stageselect_${this.props.stageSelectTheme}_hover`].texture
                    ]}
                    onClick={() => this.clearStage(stageNo, _.times(this.props.userData.numStatues))} />
            else
                return <FlatButton
                    key={stageNo}
                    disabled
                    x={stageButtonPositions[stageNo - 1][0]*this.props.width/1920 + (this.state.mousePosition.x - this.props.width/2) * 0.002}
                    y={stageButtonPositions[stageNo - 1][1]*this.props.height/1080 + (this.state.mousePosition.y - this.props.height/2) * 0.002}
                    text={stageNo}
                    textPosition={[-2, -3]}
                    textStyle={{ fill: 0xffffff, fontSize: 22, align: 'center', fontStyle: 'bold', fontFamily: 'Noto Sans KR' }}
                    texture={[
                        this.context.app.loader.resources[`btn_stageselect_disabled`].texture,
                        this.context.app.loader.resources[`btn_stageselect_disabled`].texture
                    ]} />
        }
    });

    handleMouseMove = e => {
        this.setState({ mousePosition: e.data.global });
    }

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                <AnimatedContainer
                    interactive
                    mousemove={this.handleMouseMove}
                    alpha={offset}
                    y={this.props.backgroundOffset.interpolate({ inputRange: [-1, 1], outputRange: [-height, height]})}
                    width={width}
                    height={height}>
                    {this.renderStageButtons()}
                </AnimatedContainer>
                {this.props.stageSelectTheme > 1 && <Container interactive click={() => this.props.onStageSelectThemeChange(this.props.stageSelectTheme - 1)} cursor='pointer'>
                    <SideButton x={-this.props.contentX + 60} y={height/2} />
                </Container>}
                {this.props.stageSelectTheme < 2 && <Container interactive click={() => this.props.onStageSelectThemeChange(this.props.stageSelectTheme + 1)} cursor='pointer'>
                    <SideButton x={width + this.props.contentX - 60} y={height/2} reverse />
                </Container>
                }
                <AnimatedFlatButton
                    x={-this.props.contentX + 150}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 60, height + this.props.contentY - 60] })}
                    alpha={offset}
                    text={'쇼룸으로 가기'}
                    onClick={this.props.onBackButtonClick} />
                {this.state.stageDisplayOn && <AnimatedStageDisplay
                    width={width}
                    height={height}
                    offset={this.state.stageDisplayOffset}
                    stageResult={this.state.stageResult}
                    onFinish={this.dismissStageDisplay} />}
                {this.state.loadingScreenOn && <Container interactive>
                    <Box width={width} height={height} alpha={0.5} />
                    <Text
                        anchor={[0.5, 0]}
                        text={this.state.loadingScreenMessage}
                        x={width/2}
                        y={height/2 + 60}
                        style={{ fill: 0xffffff, fontSize: 15, align: 'center', fontWeight: '300', fontFamily: 'Noto Sans KR' }} />
                </Container>}
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(StageSelectUI);

StageSelectUI.contextTypes = {
    app: PropTypes.object,
}