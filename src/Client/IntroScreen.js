import React, { Component } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import Animated from 'animated';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import Modal from 'Client/Components/Modal'

const AnimatedContainer = Animated.createAnimatedComponent(Container);

class IntroScreen extends Component {

    state = {
        noMetamaskModalOn: false,
        noMetamaskModalOffset: false,
        invalidNetworkModalOn: false,
        invalidNetworkModalOffset: false,
        plzLoginModalOn: false,
        plzLoginModalOffset: false,
    }

    getMessage = () => {
        return this.props.isWeb3Pending ?
            this.getLoadingMessage('메타마스크와 연결 중입니다.') :
            this.props.isWeb3Error ?
            <Modal text='메타마스크가 필요합니다!' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} onDismiss={this.props.onReload} /> :
            this.props.isTGVPending ?
            this.getLoadingMessage('컨트랙트 정보를 불러오고 있습니다.') :
            this.props.isTGVError ?
            <Modal text={'Ropsten 테스트넷으로 접속해주세요!\n\n메타마스크에서 네트워크를 선택할 수 있습니다.'} width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} onDismiss={this.props.onReload} /> :
            this.props.isGamePending ?
            this.getLoadingMessage('게임 정보를 불러오고 있습니다.') :
            !this.props.isGameLoaded ?
            <Modal text={'Ropsten 테스트넷으로 접속해주세요!\n\n메타마스크에서 네트워크를 선택할 수 있습니다.'} width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} onDismiss={this.props.onReload} /> :
            this.props.isUserPending ?
            this.getLoadingMessage('유저 정보를 불러오고 있습니다.') :
            !this.props.isUserLoaded ?
            <Modal text='메타마스크에 로그인해주세요!' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} onDismiss={this.props.onReload} /> :
            this.props.loadingProgress < 100 ?
            this.getLoadingMessage(`리소스를 불러오고 있습니다...${this.props.loadingProgress}%`) :
            this.getLoadingMessage('로딩을 완료하였습니다!')
    }

    getLoadingMessage = text => <Text
        anchor={[0.5, 0]}
        text={text}
        x={this.props.width/2}
        y={this.props.height/2 + 60}
        style={{ fill: 0xffffff, fontSize: 15, align: 'center', fontFamily: 'Noto Sans KR' }} />

    render() {
        return (
            <AnimatedContainer
                alpha={this.props.offset}
                width={this.props.width}
                height={this.props.height}>
                <Sprite width={this.props.width} height={this.props.height} texture={PIXI.Texture.fromImage(require('images/intro.jpg'))} />
                {this.getMessage()}
            </AnimatedContainer>
        )
    }
}

export default connect(
    (state) => ({
        isWeb3Pending: state.web3Module.isWeb3Pending,
        isWeb3Error: state.web3Module.isWeb3Error,
        isTGVPending: state.web3Module.isTGVPending,
        isTGVError: state.web3Module.isTGVError,
        isGamePending: state.gameModule.isPending,
        isGameLoaded: state.gameModule.isLoaded,
        isUserPending: state.userModule.isPending,
        isUserLoaded: state.userModule.isLoaded,
    }),
)(IntroScreen);