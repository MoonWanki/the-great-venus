import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class PageNotFound extends Component {

    state = {
        redirectCount: 3
    }

    componentDidMount = () => {
        setInterval(() => this.setState(state => ({ redirectCount: state.redirectCount - 1 })), 1000);
    }

    render() {
        return (
            this.state.redirectCount > 0 ? `페이지를 찾을 수 없습니다. ${this.state.redirectCount}초 후에 홈으로 이동합니다.` : <Redirect to='/' /> 
        )
    }
}
