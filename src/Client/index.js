import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from 'store/modules/appModule';
import * as userActions from 'store/modules/userModule';
import Animated from 'animated';
import GameBase from './GameBase';
import { Input } from 'react-materialize';
import { Stage } from 'react-pixi-fiber';
import { Helmet } from 'react-helmet';
import './index.scss';

class Client extends Component {

    state = {
        isGameReady: false,
        stageWidth: 0,
        stageHeight: 0,
        contentWidth: screen.width,
        contentHeight: screen.height,
        floatingFormPosition: new Animated.Value(0),
        nicknameFormModalOn: true,
        nicknameForm: '',
    }

    componentDidMount() {
        this.setToFullSize();
        window.onresize = () => this.setToFullSize();
        window.onpopstate = () => {
            window.location.reload();
        };
    }

    setToFullSize = () => {
        this.setState({
            stageWidth: window.innerWidth,
            stageHeight: window.innerHeight - 6
        });
    }

    onCreateNicknameBtnClick = () => {
        if(this.state.NicknameForm.length > 0) {
            this.setState({ nicknameFormModalOn: false });
            
        }
    }

    render() {

        const { stageWidth, stageHeight, contentWidth, contentHeight } = this.state;
        return (
            <div className='client-wrapper'>
                <Helmet>
                    <title>TGV Client</title>
                    <meta name="description" content="The Great Venus game client" />
                </Helmet>
                <Stage options={{ backgroundColor: 0x0 }} width={stageWidth} height={stageHeight}>
                    <GameBase
                        stageWidth={stageWidth}
                        stageHeight={stageHeight}
                        contentWidth={contentWidth}
                        contentHeight={contentHeight} />
                </Stage>

                {this.props.nicknameInputOn && <div className='floating-from' style={{ left: `${contentWidth/2}px`, top: `${contentHeight*4/7}px`}}>
                    <Input placeholder='이름이 무엇인가요?' onChange={(e, v) => this.props.AppActions.setNicknameInput(v)} />
                </div>}
            </div>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        nicknameInputOn: state.appModule.nicknameInputOn,
    }),
    (dispatch) => ({
        AppActions: bindActionCreators(appActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
    }),
)(Client);