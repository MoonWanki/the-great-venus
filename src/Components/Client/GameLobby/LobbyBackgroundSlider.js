import React, { Component, Fragment } from 'react';
import Background from 'Components/Client/Background';

export default class LobbyBackgroundSlider extends Component {

    render() {
        return (
            <Fragment>
                <Background
                    theme='main1'
                    offsetX={0}
                    offsetY={this.props.mainMenuOffset}
                    width={this.props.width}
                    height={this.props.height} />
                <Background
                    theme='forge'
                    offsetX={0}
                    offsetY={this.props.forgeOffset}
                    width={this.props.width}
                    height={this.props.height} />
                <Background
                    theme='stageselect1'
                    offsetX={0}
                    offsetY={this.props.stageSelectOffset}
                    width={this.props.width}
                    height={this.props.height} />
                <Background
                    theme='colosseum_lobby'
                    offsetX={0}
                    offsetY={this.props.colosseumOffset}
                    width={this.props.width}
                    height={this.props.height} />
            </Fragment>
        )
    }
}
