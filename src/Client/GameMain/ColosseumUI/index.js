import React, { Component, Fragment } from 'react';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as TGVApi from 'utils/TGVApi';
import Leaderboard from './Leaderboard';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as appActions from 'store/modules/appModule';
import PvPDisplay from './PvPDisplay';
import Easing from 'animated/lib/Easing';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import RewardDisplay from './RewardDisplay';

const PvPDisplayFadeDuration = 500;
const PvPDisplayFadeEasing = Easing.bezier(0, 0.8, 0.3, 1);

const AnimatedPvPDisplay = Animated.createAnimatedComponent(PvPDisplay);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);
const AnimatedLeaderboard = Animated.createAnimatedComponent(Leaderboard);
const AnimatedRewardDisplay = Animated.createAnimatedComponent(RewardDisplay);

class ColosseumUI extends Component {

    state = {
        loadingScreenOn: false,
        loadingScreenMessage: '',
        PvPDisplayOn: false,
        PvPDisplayOffset: new Animated.Value(0),
        PvPResult: null,
        enemyData: null,
        isUpdating: false,
        leaderboard: [],
        colosseumInfo: null,
        refundTimeLeft: '로딩중입니다...'
    }

    componentDidMount = () => {
        this.update();
    }

    update = async () => {
        this.setState({ isUpdating: true });
        try {
            const { rank: myRank } = this.props.userData;
            const from = (myRank <= 10) ? 1 : (myRank - 10);
            const upperTenPlayersAddrList = await Promise.all(_.times(10, i=>this.props.TGV.rankToOwner.call(from + i)));
            const upperTenPlayers = await Promise.all(upperTenPlayersAddrList.map(addr => TGVApi.getUser(this.props.TGV, addr)));
            const colosseumInfo = await TGVApi.getColosseumInfo(this.props.TGV);
            this.props.web3.eth.getBlock('latest', (err, i) => this.setRefundTimer(i.timestamp, colosseumInfo.nextRefundTime.getTime()));
            this.setState({
                leaderboard: upperTenPlayers.map((info, i) => ({ ...info, addr: upperTenPlayersAddrList[i] })),
                colosseumInfo: colosseumInfo,
                isUpdating: false,
            });
        } catch (err) {
            console.error(err);
            this.setState({ isUpdating: false });
        } finally {
            // console.log('abcd')
            // setTimeout(this.update, 1000);
        }
    }

    setRefundTimer = (now, to) => {
        if(to < now) {
            this.setState({ refundTimeLeft: "잠시" });
            return;
        }
        const timeLeft = to - now;
        const days = Math.floor(timeLeft/86400);
        const hours = Math.floor(timeLeft/3600)%24;
        const minutes = Math.floor(timeLeft/60)%60;
        const seconds = timeLeft%60;
        this.setState({ refundTimeLeft: `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`});
        setTimeout(() => this.setRefundTimer(now + 1, to), 1000);
    }

    onCompareSpec = idx => {
        window.Materialize.toast("준비 중입니다.", 1500);
    }

    onFight = async idx => {
        const { addr: enemyAddr } = this.state.leaderboard[idx];
        try {
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '결투장에 입장하고 있습니다. 잠시만 기다려주세요.' });
            this.props.AppActions.setPreloader(true);
            const PvPResult = await TGVApi.matchWithPlayer(this.props.TGV, enemyAddr, this.props.web3.eth.coinbase);
            const enemyData = await TGVApi.getUserData(this.props.TGV, enemyAddr);
            this.showPvPDisplay(enemyData, PvPResult);
        } catch(err) {
            console.error(err);
        } finally {
            this.setState({ loadingScreenOn: false });
            this.props.AppActions.setPreloader(false);
        }
    }

    showPvPDisplay = (enemyData, PvPResult) => {
        this.setState({
            PvPResult: PvPResult,
            enemyData: enemyData,
            PvPDisplayOn: true,
        });
        Animated.timing(this.state.PvPDisplayOffset, { toValue: 1, duration: PvPDisplayFadeDuration, easing: PvPDisplayFadeEasing }).start();
    }

    dismissPvPDisplay = async () => {
        try {
            this.props.AppActions.setPreloader(true);
            this.setState({ loadingScreenOn: true, loadingScreenMessage: '데이터 동기화 중입니다. 잠시만 기다려주세요.' });
            await this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
            await this.update();
        } catch (err) {
            console.error(err);
        } finally {
            Animated.timing(this.state.PvPDisplayOffset, { toValue: 0, duration: PvPDisplayFadeDuration, easing: PvPDisplayFadeEasing }).start();
            setTimeout(()=>this.setState({
                PvPDisplayOn: false,
                PvPResult: null,
                enemyInfo: null,
                loadingScreenOn: false,
            }), PvPDisplayFadeDuration);
            this.props.AppActions.setPreloader(false);
        }
    }

    render() {
        const { offset, width, height } = this.props;
        return (
            <Fragment>
                <AnimatedRewardDisplay
                    x={width/2 - 510}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height/2 - 200, height/2 - 300]})}
                    alpha={offset}
                    width={500}
                    height={600}
                    isUpdating={this.state.isUpdating}
                    colosseumInfo={this.state.colosseumInfo}
                    refundTimeLeft={this.state.refundTimeLeft} />
                <AnimatedLeaderboard
                    x={width/2 + 10}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height/2 - 200, height/2 - 300]})}
                    alpha={offset}
                    width={500}
                    height={600}
                    isUpdating={this.state.isUpdating}
                    leaderboard={this.state.leaderboard}
                    colosseumInfo={this.state.colosseumInfo}
                    onCompareSpec={this.onCompareSpec}
                    onFight={this.onFight} />
                <AnimatedFlatButton
                    x={-this.props.contentX + 150}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [height + this.props.contentY + 60, height + this.props.contentY - 60] })}
                    alpha={offset}
                    text={'쇼룸으로 가기'}
                    onClick={this.props.onBackButtonClick} />
                {this.state.PvPDisplayOn && <AnimatedPvPDisplay
                    width={width}
                    height={height}
                    offset={this.state.PvPDisplayOffset}
                    enemyData={this.state.enemyData}
                    PvPResult={this.state.PvPResult}
                    onFinish={this.dismissPvPDisplay} />}
                {this.state.loadingScreenOn && <Container interactive>
                    <Box width={width} height={height} alpha={0.5} />
                    <Text
                        anchor={[0.5, 0.5]}
                        text={this.state.loadingScreenMessage}
                        x={width/2}
                        y={height/2 + 60}
                        style={{ fill: 0xffffff, fontSize: 15, align: 'center', fontFamily: 'Noto Sans KR' }} />
                </Container>}
            </Fragment>
        );
    }
}

export default connect(
    state => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
        userData: state.userModule.userData,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    })
)(ColosseumUI);