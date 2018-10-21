import React, { Component, Fragment } from 'react';

import { Link } from 'react-router-dom';
import Tada from 'react-reveal/Tada';
import Fade from 'react-reveal/Fade';
import Flip from 'react-reveal/Flip';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import $ from 'jquery';
import './Home.scss';
import { Icon, Footer } from 'react-materialize';
import { Parallax } from 'react-parallax';
import networkImg from 'images/network.jpg';
import crew1 from 'images/crew_moonwanki.jpg';
import crew2 from 'images/crew_jamlee.jpg';
import crew3 from 'images/crew_jisoohan.jpg';

class Home extends Component {

    state = {
        openNoBrowserModal: false,
        openNoMetamaskModal: false,
        text: {
            noBrowserModal: {
                title: {
                    'en': 'Not supported browser!',
                    'ko': '엥? 크롬이 아니신데요?',
                },
                content: {
                    'en': 'You should use Chrome or Firefox to enjoy this game.',
                    'ko': '크롬이나 파폭을 까세요. 어서 이 게임을 즐겨야 하지 않겠어요?',
                },
                getChromeBtn: {
                    'en': 'GET CHROME',
                    'ko': '크롬 설치하기',
                },
                getFirefoxBtn: {
                    'en': 'GET FIREFOX',
                    'ko': '파이어폭스 설치하기',
                },
            },
            noMetamaskModal: {
                title: {
                    'en': 'You need to have Metamask!',
                    'ko': '정상적인 플레이를 위해 메타마스크를 설치해주세요!',
                },
                content: {
                    'en': 'Get Metamask and set your Ethereum account! Then you will be ready to enjoy!',
                    'ko': '메타마스크는 크롬 또는 파이어폭스에서 이용할 수 있는 이더리움 지갑입니다. 설치하는 데 1분도 걸리지 않습니다!',
                },
                getMetamaskBtn: {
                    'en': 'GET METAMASK',
                    'ko': '메타마스크 설치하기',
                },
                startAnywayBtn: {
                    'en': 'START ANYWAY',
                    'ko': '일단 접속',
                },
            },
            plzLogin: {
                'en': 'Please login to Metamask!',
                'ko': '메타마스크에 로그인 해주세요!',
            },
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
            // if(!this.props.selectedAddress) {
            //     window.Materialize.toast(this.state.text.plzLogin[this.props.language], 1500);
            // } else {
            //     this.props.history.push('/client');
            // }
            window.open('/client');
        }
    }


    render() {
        const { openNoBrowserModal, openNoMetamaskModal, text } = this.state;
        const { language, selectedAddress } = this.props;
        return (
            <Fragment>

                <Modal open={openNoBrowserModal} onClose={() => this.setState({ openNoBrowserModal: false })} center>
                    <h5>{text.noBrowserModal.title[language]}</h5>
                    <p>{text.noBrowserModal.content[language]}</p>
                    <a href='https://www.google.com/chrome/' target="_blank">
                        <button className="btn btn-action" onClick={() => this.setState({ openNoBrowserModal: false })}>
                            {text.noBrowserModal.getChromeBtn[language]}
                        </button>
                    </a>
                    <a href='https://www.mozilla.org' target="_blank">
                        <button className="btn btn-action" onClick={() => this.setState({ openNoBrowserModal: false })}>
                            {text.noBrowserModal.getFirefoxBtn[language]}
                        </button>
                    </a>
                </Modal>

                <Modal open={openNoMetamaskModal} onClose={() => this.setState({ openNoMetamaskModal: false })} center>
                    <h5>{text.noMetamaskModal.title[language]}</h5>
                    <p>
                        
                    </p>
                    <a href='https://metamask.io/' target="_black">
                        <button className="btn btn-action" onClick={() => this.setState({ openNoMetamaskModal: false })}>
                            {text.noMetamaskModal.getMetamaskBtn[language]}
                        </button>
                    </a>
                    <a href='/client' target="_black">
                        <button className="btn btn-action" onClick={() => this.setState({ openNoMetamaskModal: false })}>
                            {text.noMetamaskModal.startAnywayBtn[language]}
                        </button>
                    </a>
                </Modal>

                <div className="home-banner">
                    <div className="home-banner-title">
                        <Fade left distance='100px' duration={500}>
                            <p className="home-banner-title-text">The Great Venus</p>
                        </Fade>
                        <Fade delay={300} duration={500}>
                            <Tada delay={500} duration={900}>
                                <div className='home-banner-start' onClick={this.onStartButtonClick}>
                                    START
                                </div>
                            </Tada>
                        </Fade>
                    </div>
                </div>
                {selectedAddress ?
                    <Link to='/test' target='_blank'>
                        <div style={{ position: "absolute", top: '5px', left: '5px', color: 'lightgrey' }}>
                            <Icon>settings</Icon>
                        </div>
                    </Link> : null}

                <div className="home-section" style={{ background: '#e5e4e0' }}>
                    <Fade bottom duration={400} distance='60px' fraction={1}>
                        <p className='home-section-title'>
                            Who is <span style={{fontWeight: '800'}}>The Great Venus?</span>
                        </p>
                    </Fade>
                    <Fade bottom duration={400} distance='60px' fraction={0.8}>
                        <p className='home-section-text'>
                            The Guiliano's wish is to see the Venus, who has ULTIMATE Necklace, the greatest equipment in the world.<br />
                            Do you know? They can get more power by acquiring more special necklace!<br />
                            Everyone's hope is to be strong, and so is Guiliano.<br />
                            That's why Guiliano finally decided to go on an adventure.
                        </p>
                    </Fade>
                </div>

                <Parallax bgImage={networkImg} strength={500}>
                    <div className="home-section" style={{ color: 'white' }}>
                        <Fade bottom duration={400} distance='60px' fraction={1}>
                            <p className='home-section-title'>
                                <span style={{fontWeight: '800'}}>Turn-based RPG</span> on <span style={{fontWeight: '800'}}>Ethereum network</span>
                            </p>
                        </Fade>
                        <Fade bottom duration={400} distance='60px' fraction={0.8}>
                            <p className='home-section-text'>
                                TGV doesn't have any centralized stuff for running.<br />
                                All transactions are <span style={{fontWeight: '700'}}>decentralized</span>, <span style={{fontWeight: '700'}}>transparent</span>, and <span style={{fontWeight: '700'}}>safe</span>.<br />
                                You can take care of your creatures in TGV every 24/7.<br />
                            </p>
                        </Fade>
                    </div>
                </Parallax>
                
                <div className="home-section" style={{ background: '#e5e4e0' }}>
                    <Fade bottom duration={400} distance='60px' fraction={1}>
                        <p className='home-section-title'>
                            Get in <span style={{fontWeight: '800'}}>high rank</span> and become <span style={{fontWeight: '800'}}>rich!</span>
                        </p>
                    </Fade>
                    <Fade bottom duration={400} distance='60px' fraction={0.8}>
                        <p className='home-section-text'>
                            There is a big deal, <span style={{ fontWeight: '700'}}>Colosseum</span>, a PvP ranking system.<br />
                            TGV daily distributes <span style={{fontWeight: '700'}}>95%</span> of Ethereum it gathered during the day back to high rankers.<br />
                            That means, if you are in high rank, you can get profits everyday!<br />
                            Even, the higher your rank, the larger your allocation!<br />
                            Get victory in the Colosseum and raise your rank! Then your daily profits gotta be awesome!
                        </p>
                    </Fade>
                </div>

                <div className="home-section" style={{ background: '#7e7b78', color: 'white' }}>
                    <Fade bottom duration={400} distance='40px' fraction={1}>
                        <p className='home-section-title' style={{ fontSize: '2.2rem', fontWeight: '400', padding: '10px' }}>
                            Our crews
                        </p>
                    </Fade>
                    <Flip left duration={1500} fraction={1}>
                        <div style={{ width: '50px', height: '3px', background: 'white', margin: 'auto' }} />
                    </Flip>
                    <div className='home-section-team-wrapper'>
                        <Fade bottom distance='60px' duration={400} fraction={0.6}>
                            <div className="home-section-team-item">
                                <a target='_blank' href='https://www.octopusfantasy.com'><div className='home-section-team-avatar' style={{ backgroundImage: `url(${crew1})` }} /></a>
                                <h5>Moon Wanki</h5>
                                <div style={{ width: '30px', height: '1px', background: 'white', margin: '5px 0 15px' }} />
                                <p>PM</p>
                                <p>Front-End</p>
                                <p>Back-End</p>
                            </div>
                        </Fade>
                        <Fade bottom distance='60px' duration={400} fraction={0.6} delay={100}>
                            <div className="home-section-team-item">
                                <div className='home-section-team-avatar' style={{ backgroundImage: `url(${crew2})` }} />
                                <h5>Jamlee</h5>
                                <div style={{ width: '30px', height: '1px', background: 'white', margin: '5px 0 15px' }} />
                                <p>Back-End</p>
                                <p>QA</p>
                            </div>
                        </Fade>
                        <Fade bottom distance='60px' duration={400} fraction={0.6} delay={200}>
                            <div className="home-section-team-item">
                                <div className='home-section-team-avatar' style={{ backgroundImage: `url(${crew3})` }} />
                                <h5>Jisoo Han</h5>
                                <div style={{ width: '30px', height: '1px', background: 'white', margin: '5px 0 15px' }} />
                                <p>Art Design</p>
                                <p>UI·UX Design</p>
                            </div>
                        </Fade>
                    </div>
                </div>

                <Footer copyrights="ⓒ 2018 The Great Venus. All rights reserved."
                        moreLinks={null}
                        links={
                            <ul>
                                <li><a target='_blank' href="https://github.com/MoonWanki/the-great-venus">GitHub</a></li>
                                <li><a target='_blank' href="https://www.octopusfantasy.com">Octopus Fantasy</a></li>
                            </ul>
                        }
                        className='grey darken-3'>
                    <h5 className="grey-text text-lighten-2">The Great Venus</h5>
                    <p className="grey-text text-lighten-2">This project is for <span style={{ color: 'gold' }}>2018-2 Media Project</span> of the <a target='_blank' href='http://media.ajou.ac.kr'>Dept. of Digital Media</a> at <a target='_blank' href='http://www.ajou.ac.kr'>Ajou Univ.</a></p>
                </Footer>

            </Fragment>
        );
    }
}

export default connect(
    (state) => ({
      web3Instance: state.web3Module.web3Instance,
      selectedAddress: state.web3Module.selectedAddress,
      language: state.appModule.language,
    })
)(Home);