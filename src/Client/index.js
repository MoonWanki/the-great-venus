import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from 'store/modules/appModule';
import * as userActions from 'store/modules/userModule';
import Animated from 'animated';
import GameBase from './GameBase';
import { Stage } from 'react-pixi-fiber';
import Modal from 'react-responsive-modal';
import { Input, Button } from 'react-materialize';
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
        userNameFormModalOn: true,
        userNameForm: '',
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

    onCreateUserNameBtnClick = () => {
        if(this.state.userNameForm.length > 0) {
            this.setState({ userNameFormModalOn: false });
            
        }
    }

    render() {
        return (
            <div className='canvas-wrapper'>
                <Helmet>
                    <title>TGV Client</title>
                    <meta name="description" content="The Great Venus game client" />
                </Helmet>
                <Stage options={{ backgroundColor: 0x0 }} width={this.state.stageWidth} height={this.state.stageHeight}>
                    <GameBase
                        stageWidth={this.state.stageWidth}
                        stageHeight={this.state.stageHeight}
                        contentWidth={this.state.contentWidth}
                        contentHeight={this.state.contentHeight} />
                </Stage>
                <Modal
                    showCloseIcon={false}
                    closeOnOverlayClick={false}
                    closeOnEsc={false}
                    open={this.props.nicknameModalOn}
                    onClose={this.props.closeNicknameModal}
                    center>
                    <h2>닉네임을 설정해주세요</h2>
                    <Input s={6} onChange={(e, v)=>this.setState({ userNameForm: v })} />
                    <Button floating large flat className='grey lighten-3' onClick={this.onCreateUserNameBtnClick}>OK</Button>
                </Modal>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        nicknameModalOn: state.appModule.nicknameModalOn,
    }),
    (dispatch) => ({
        AppActions: bindActionCreators(appActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
    }),
)(Client);