import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import $ from 'jquery';
import './Home.scss';
import { Icon, Footer } from 'react-materialize';
import { Parallax } from 'react-parallax';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openNoBrowserModal: false,
            openNoMetamaskModal: false,
            openPlzLoginModal: false,
        }
    }

    componentDidMount() {
        $(window).scroll(()=>{
            var scrolled = $(window).scrollTop();
            $('.home-banner').css('top', scrolled*0.5 + 'px');
        })
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

                <div className="home-banner">
                    <div className="home-banner-title">
                        <Fade left duration={800}>
                            <p className="home-banner-title-text">The Great Venus</p>
                        </Fade>
                        <div className='home-banner-start' onClick={this.onStartButtonClick}>
                            START
                        </div>
                    </div>
                </div>

                <Link to='/test'>
                    <div style={{ position: "absolute", top: '5px', left: '5px', color: 'lightgrey' }}>
                        <Icon>settings</Icon>
                    </div>
                </Link>

                <div className="home-section-1">
                    <Fade bottom duration={500} fraction={1}>
                        <p className='home-section-title'>
                            Who is <span style={{fontWeight: '800'}}>The Great Venus?</span>
                        </p>
                    </Fade>
                    <Fade bottom duration={500} fraction={0.5}>
                        <p className='home-section-text'>
                            The Guiliano's wish is to see the Venus, who has ULTIMATE Necklace, the greatest equipment in the world.<br />
                            Do you know? They can get more power by acquiring more special necklace!<br />
                            Everyone's hope is to be strong, and so is Guiliano.<br />
                            That's why Guiliano finally decided to go on an adventure.
                        </p>
                    </Fade>
                </div>

                <Parallax bgImage={require('../../images/network.jpg')} strength={500}>
                    <div className="home-section-2">
                        <Fade bottom duration={500} fraction={1}>
                            <p className='home-section-title'>
                                <span style={{fontWeight: '800'}}>Turn-based RPG</span> on <span style={{fontWeight: '800'}}>Ethereum network</span>
                            </p>
                        </Fade>
                        <Fade bottom duration={500} fraction={0.5}>
                            <p className='home-section-text'>
                                Decentralized. Safe by blockchain.<br />
                                You can grow your friends every on 24/7.<br />
                                All of data communication will be in the safe, transparent, public blockchain network whenever and forever.
                            </p>
                        </Fade>
                    </div>
                </Parallax>
                
                <div className="home-section-3">
                    <Fade bottom duration={500} fraction={1}>
                        <p className='home-section-title'>
                            Be <span style={{fontWeight: '800'}}>Ranker</span> and Be <span style={{fontWeight: '800'}}>Rich!</span>
                        </p>
                    </Fade>
                    <Fade bottom duration={500} fraction={0.5}>
                        <p className='home-section-text'>
                            There is a big deal, Colosseum.<br />
                            Make your rank higher! Then your daily rewards gotta be nice!
                        </p>
                    </Fade>
                </div>

                <div className="home-section-4">
                    <Fade bottom duration={500} fraction={1}>
                        <p className='home-section-title'>
                            Our Team
                        </p>
                    </Fade>
                    <Fade bottom duration={500} fraction={0.5}>
                    <p className='home-section-text'>
                        Moon Wanki<br />
                        Jamlee<br />
                        Jisoo Han<br />
                    </p>
                    </Fade>
                </div>

                <Footer copyrights="ⓒ 2018 The Great Venus Team. All rights reserved."
                moreLinks={
                    <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
                }
                links={
                    <ul>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/MoonWanki/the-great-venus">GitHub</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://www.octopusfantasy.com">Octopus Fantasy</a></li>
                    </ul>
                }
                className='grey darken-2'
                >
                    <h5 className="white-text">The Great Venus</h5>
                    <p className="grey-text text-lighten-4">This project is for <span style={{fontWeight: '700', color: 'gold'}}>2018-2 Media Project</span> of the <a href='http://media.ajou.ac.kr'><span style={{fontWeight: '500'}}>Dept. of Digital Media</span></a> at <a href='http://www.ajou.ac.kr'><span style={{fontWeight: '500'}}>Ajou Univ.</span></a></p>
                </Footer>

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