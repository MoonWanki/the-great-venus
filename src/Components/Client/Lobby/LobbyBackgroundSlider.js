import React, { Component, Fragment } from 'react';
import Background from 'Components/Client/Components/Background';

export default class LobbyBackgroundSlider extends Component {

    render() {
        const { skyOffset, homeOffset, showroomOffset, forgeOffset, stageSelectOffset, colosseumOffset, ...rest } = this.props;
        return (
            <Fragment>
                <Background
                    theme='sky1'
                    offsetX={0}
                    offsetY={skyOffset}
                    {...rest} />
                <Background
                    theme='home1'
                    offsetX={0}
                    offsetY={homeOffset}
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
                    theme='stageselect1'
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
