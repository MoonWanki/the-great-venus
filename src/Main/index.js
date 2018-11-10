import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, PageNotFound } from './Pages';

class Main extends Component {

    render() {
        return (
            <Switch>
                <Route exact path='/' component={Home} />
                <Route component={PageNotFound} />
            </Switch>
        )
    }
}

export default Main;