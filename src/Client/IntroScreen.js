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
            <Text text={'메타마스크와 연결 중입니다.'} style={{ fill: 0xffffff, fontSize: 20 }} /> :
            this.props.isWeb3Error ?
            <Modal text='메타마스크가 필요합니다!' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} {...this.props} onDismiss={this.props.onReload} /> :
            this.props.isTGVPending ?
            <Text text={'컨트랙트 정보를 불러오고 있습니다.'} style={{ fill: 0xffffff, fontSize: 20 }} /> :
            this.props.isTGVError ?
            <Modal text='네트워크를 확인해주세요.' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} {...this.props} onDismiss={this.props.onReload} /> :
            this.props.isGamePending ?
            <Text text={'게임 정보를 불러오고 있습니다.'} style={{ fill: 0xffffff, fontSize: 20 }} /> :
            !this.props.isGameLoaded ?
            <Modal text='네트워크를 확인해주세요.' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} {...this.props} onDismiss={this.props.onReload} /> :
            this.props.isUserPending ?
            <Text text={'유저 정보를 불러오고 있습니다.'} style={{ fill: 0xffffff, fontSize: 20 }} /> :
            !this.props.isUserLoaded ?
            <Modal text='메타마스크에 로그인해주세요!' width={500} height={300} buttonText={'다시 로드'} offset={new Animated.Value(1)} {...this.props} onDismiss={this.props.onReload} /> :
            this.props.loadingProgress < 100 ?
            <Text text={`리소스를 불러오고 있습니다...${this.props.loadingProgress}%\n${this.props.loadingContent}`} style={{ fill: 0xffffff, fontSize: 20 }} /> :
            <Text text={'로딩을 완료하였습니다!'} style={{ fill: 0xffffff, fontSize: 20 }} />
    }

    render() {
        return (
            <AnimatedContainer
                alpha={this.props.offset}
                width={this.props.contentWidth}
                height={this.props.contentHeight}>
                <Sprite x={0} y={0} width={this.props.contentWidth} height={this.props.contentWidth*9/16} alpha={1} texture={PIXI.Texture.fromImage(require('images/intro.jpg'))} />
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