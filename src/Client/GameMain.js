import React, { Component, Fragment } from 'react';
import Lobby from './Lobby';
import Field from './Field';

export default class GameMain extends Component {

    render() {
        return (
            <Fragment>
                <Lobby {...this.props} />
                {/* {this.state.onBattle && <Field />}
                {this.state.onColosseum && <Field isColosseum />} */}
            </Fragment>
        )
    }
}
