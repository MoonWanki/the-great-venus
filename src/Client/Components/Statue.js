import React, { Component } from 'react'
import { Sprite } from 'react-pixi-fiber';
import PropTypes from 'prop-types';

class Statue extends Component {

    state = {
        statues: [
            { src: this.context.app.loader.resources.statue0 },
            { src: this.context.app.loader.resources.statue1 },
            { src: this.context.app.loader.resources.statue2 },
            { src: this.context.app.loader.resources.statue3 },
        ]
    }

    render() {
        return (
            <Sprite
                texture={this.state.statues[this.props.no].src.texture}
                {...this.props} />
        )
    }
}
export default Statue;

Statue.contextTypes = {
    app: PropTypes.object,
};
