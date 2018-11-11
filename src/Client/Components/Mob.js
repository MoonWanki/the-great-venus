import React, { Component } from 'react'
import { Sprite, Container } from 'react-pixi-fiber';
import PropTypes from 'prop-types';

class Statue extends Component {

    state = {
        mobs: [
            this.context.app.loader.resources.mob1,
            this.context.app.loader.resources.mob2,
            this.context.app.loader.resources.mob3,
            this.context.app.loader.resources.mob4,
        ],
    }

    render() {
        return (
            <Container
                x={this.props.x || 0}
                y={this.props.y || 0}
                scale={this.props.scale || 1}
                interactive={this.props.interactive || false}
                click={this.props.click || null}
                cursor={this.props.interactive ? 'pointer' : 'default'}
                mask={this.props.mask || null}>
                <Sprite
                    anchor={[0.5, 1]}
                    texture={this.state.mobs[this.props.no - 1].texture} />
            </Container>
        )
    }
}
export default Statue;

Statue.contextTypes = {
    app: PropTypes.object,
};
