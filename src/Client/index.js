import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from 'store/modules/appModule';
import * as userActions from 'store/modules/userModule';
import * as canvasActions from 'store/modules/canvasModule';
import GameBase from './GameBase';
import { Input, Preloader } from 'react-materialize';
import { Stage } from 'react-pixi-fiber';
import { Helmet } from 'react-helmet';
import './index.scss';

class Client extends Component {

    state = {
        isGameReady: false,
        stageWidth: 0,
        stageHeight: 0,
    }

    componentDidMount() {
        this.setToFullSize();
        window.onresize = this.setToFullSize;
    }

    setToFullSize = () => {
        const stageWidth = window.innerWidth;
        const stageHeight = window.innerHeight - 6;
        this.setState({
            stageWidth: stageWidth,
            stageHeight: stageHeight,
        });
        this.props.CanvasActions.setContentPosition({
            stageWidth: stageWidth,
            stageHeight: stageHeight,
        })
    }

    render() {

        const { stageWidth, stageHeight } = this.state;
        return (
            <div className='client-wrapper'>
                <Helmet>
                    <title>TGV Client</title>
                    <meta name="description" content="The Great Venus game client" />
                </Helmet>
                <Stage options={{ backgroundColor: 0x0 }} width={stageWidth} height={stageHeight}>
                    <GameBase
                        x={this.props.contentX}
                        y={this.props.contentY}
                        width={this.props.contentWidth}
                        height={this.props.contentHeight} />
                </Stage>

                {this.props.nicknameInputOn &&
                <div className='floating-form' style={{ left: '50%', top: '60%'}}>
                    <Input placeholder='이름이 무엇인가요?' onChange={(e, v) => this.props.AppActions.setNicknameInput(v)} />
                </div>}

                {this.props.preloaderOn &&
                <div className='floating-preloader'>
                    <Preloader flashing size='big' />
                </div>}
            </div>
        );
    }
}

export default connect(
    state => ({
        web3Instance: state.web3Module.web3Instance,
        nicknameInputOn: state.appModule.nicknameInputOn,
        isUserPending: state.userModule.isPending,
        isGamePending: state.gameModule.isPending,
        preloaderOn: state.appModule.preloaderOn,
        contentX: state.canvasModule.contentX,
        contentY: state.canvasModule.contentY,
        contentWidth: state.canvasModule.contentWidth,
        contentHeight: state.canvasModule.contentHeight,
    }),
    dispatch => ({
        AppActions: bindActionCreators(appActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
        CanvasActions: bindActionCreators(canvasActions, dispatch),
    }),
)(Client);