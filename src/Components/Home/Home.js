import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import './Home.scss';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openInvalidBrowserModal: false,
            openMetamaskUninstalledModal: false,
        }
    }

    onStartButtonClick = () => {
        if(!this.props.web3Instance) {
            if(typeof InstallTrigger !== 'undefined' || (!!window.chrome && !!window.chrome.webstore)) { // if neither chrome or firefox
                this.setState({ openMetamaskUninstalledModal: true });
            } else {
                this.setState({ openInvalidBrowserModal: true });
            }
        } else {
            this.props.history.push('/game');
        }
    }

    render() {
        const { openInvalidBrowserModal, openMetamaskUninstalledModal } = this.state
        return (
            <Fragment>
                <Modal open={openInvalidBrowserModal} onClose={() => this.setState({ openInvalidBrowserModal: false })} center>
                        <h2>엥? 크롬이 아니신데요?</h2>
                        <p>
                            크롬이나 파폭을 까세요. 어서 이 게임을 즐겨야 하지 않겠어요?
                        </p>
                        <button className="btn btn-action">크롬 설치</button>
                        <button className="btn btn-action">파폭 설치</button>
                </Modal>
                <Modal open={openMetamaskUninstalledModal} onClose={() => this.setState({ openMetamaskUninstalledModal: false })} center>
                        <h2>메타마스크를 까셔야죠!</h2>
                        <p>
                            이더리움 게임을 하려면 메타마스크는 필수입니다. 지금 당장 설치하세요. 1분도 안 걸립니다.
                        </p>
                        <button className="btn btn-action">메타마스크 설치</button>
                </Modal>
                <div>
                    <div className="home-banner">
                        <div className="home-banner-title">
                            <Fade left duration={800} distance='100px'>
                                <p className="home-banner-title-text">The Great Venus</p>
                            </Fade>
                            <div className='home-banner-start' onClick={this.onStartButtonClick}>
                                START
                            </div>
                        </div>
                        <div className="home-banner-venus" />
                    </div>
                    <Link to='/test'><div style={{ position: "absolute", top: '0', width: '120px', background: 'goldenrod', color: 'black' }}>관리자페이지</div></Link>
                    <div className="home-section">
                        <p><span style={{fontWeight: '700'}}>Decentralized</span> RPG in the Ethereum network.</p>
                        What are you waiting for?
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(
    (state) => ({
      web3Instance: state.web3Module.web3Instance,
    })
)(Home);