import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import './Home.scss';

class Home extends Component {
    render() {
        return (
            <div>
                <div className="home-banner">
                    <div className="home-banner-title">
                        <p>The Great Venus</p>
                        <Link to='/game'>
                            <div className='home-banner-start'>
                                <span style={{ color: 'black', textDecoration: 'none' }}>START</span>
                            </div>
                        </Link>
                    </div>
                    <div className="home-banner-venus">
                        
                    </div>
                </div>
                <Link to='/test'><div style={{ width: '120px', background: 'goldenrod', color: 'black' }}>관리자페이지</div></Link>
            </div>
        );
    }
}

export default Home;