import React, { Component, Fragment } from 'react';
import Background from 'Client/Components/Background';

const rand = Math.floor(Math.random()*4 + 1);

export default class LobbyBackgroundSlider extends Component {

    render() {
        const { skyOffset, homeOffset, showroomOffset, forgeOffset, stageSelectOffset, stageSelectTheme, colosseumOffset, ...rest } = this.props;
        return (
            <Fragment>
                <Background
                    theme={`home${rand}`}
                    offsetX={0}
                    offsetY={homeOffset}
                    {...rest} />
                <Background
                    theme={`sky${rand}`}
                    offsetX={0}
                    offsetY={skyOffset}
                    {...rest} />
                <Background
                    theme='showroom'
                    offsetX={0}
                    offsetY={showroomOffset}
                    {...rest} />
                <Background
                    theme='forge'
                    offsetX={0}
                    offsetY={forgeOffset}
                    {...rest} />
                <Background
                    theme={`stageselect${stageSelectTheme}`}
                    offsetX={0}
                    offsetY={stageSelectOffset}
                    {...rest} />
                <Background
                    theme='colosseum_lobby'
                    offsetX={0}
                    offsetY={colosseumOffset}
                    {...rest} />
            </Fragment>
        )
    }
}
