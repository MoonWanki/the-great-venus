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
            openNoBrowserModal: false,
            openNoMetamaskModal: false,
            openPlzLoginModal: false,
        }
    }

    onStartButtonClick = () => {
        if(!this.props.web3Instance) {
            if(typeof InstallTrigger !== 'undefined' || (!!window.chrome && !!window.chrome.webstore)) { // if cannot find metamask
                this.setState({ openNoMetamaskModal: true });
            } else { // if neither chrome or firefox
                this.setState({ openNoBrowserModal: true });
            }
        } else { // if metamask OK
            if(!this.props.selectedAddress) {
                this.setState({ openPlzLoginModal: true });
            } else {
                this.props.history.push('/game');
            }
        }
    }

    render() {
        const { openNoBrowserModal, openNoMetamaskModal, openPlzLoginModal } = this.state;
        return (
            <Fragment>

                <Modal open={openNoBrowserModal} onClose={() => this.setState({ openNoBrowserModal: false })} center>
                        <h5>엥? 크롬이 아니신데요?</h5>
                        <p>
                            크롬이나 파폭을 까세요. 어서 이 게임을 즐겨야 하지 않겠어요?
                        </p>
                        <a href='https://www.google.com/chrome/' target="_blank">
                            <button className="btn btn-action" onClick={() => this.setState({ openNoBrowserModal: false })}>
                                get Chrome
                            </button>
                        </a>
                        <a href='https://www.mozilla.org' target="_blank">
                            <button className="btn btn-action" onClick={() => this.setState({ openNoBrowserModal: false })}>
                                get Firefox
                            </button>
                        </a>
                </Modal>

                <Modal open={openNoMetamaskModal} onClose={() => this.setState({ openNoMetamaskModal: false })} center>
                        <h5>메타마스크를 까셔야죠!</h5>
                        <p>
                            이더리움 게임을 하려면 메타마스크는 필수입니다. 지금 당장 설치하세요. 1분도 안 걸립니다.
                        </p>
                        <a href='https://metamask.io/' target="_black">
                            <button className="btn btn-action" onClick={() => this.setState({ openNoMetamaskModal: false })}>
                                GET METAMASK
                            </button>
                        </a>
                </Modal>

                <Modal open={openPlzLoginModal} onClose={() => this.setState({ openPlzLoginModal: false })} center>
                        <h5>메타마스크에 로그인 해주세요!</h5>
                        <p>
                            오른쪽 위의 여우 얼굴을 눌러주세요! 여우가 당신을 기다리고 있습니다.
                        </p>
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
      selectedAddress: state.web3Module.selectedAddress,
    })
)(Home);