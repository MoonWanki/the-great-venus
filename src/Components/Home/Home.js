import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import './Home.scss';

class Home extends Component {
    render() {
        return (
            <div>
                <div className="home-banner">
                    <div className="home-banner-title">
                        <Fade left duration={800} distance='100px'>
                            <p className="home-banner-title-text">The Great Venus</p></Fade>
                        <Link to='/game'>
                            <div className='home-banner-start'>
                                START
                            </div>
                        </Link>
                    </div>
                    <div className="home-banner-venus" />
                </div>
                <Link to='/test'><div style={{ position: "absolute", top: '0', width: '120px', background: 'goldenrod', color: 'black' }}>관리자페이지</div></Link>
                <div className="home-section">
                    <p><span style={{fontWeight: '700'}}>Decentralized</span> RPG in the Ethereum network.</p>
                    What are you waiting for?
                </div>
            </div>
        );
    }
}

export default Home;