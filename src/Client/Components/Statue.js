import React, { Component, Fragment } from 'react'
import { Sprite, Container } from 'react-pixi-fiber';
import PropTypes from 'prop-types';

class Statue extends Component {

    state = {
        statues: [
            {
                src: this.context.app.loader.resources.statue0,
                skin: [
                    this.context.app.loader.resources.statue0_skin1,
                    this.context.app.loader.resources.statue0_skin2,
                    this.context.app.loader.resources.statue0_skin3,
                ],
                look: {
                    hair: [
                        this.context.app.loader.resources.statue0_hair1,
                        this.context.app.loader.resources.statue0_hair2,
                        this.context.app.loader.resources.statue0_hair3,
                        this.context.app.loader.resources.statue0_hair4,
                        this.context.app.loader.resources.statue0_hair5,
                    ],
                    eye: [
                        this.context.app.loader.resources.statue0_eye1,
                        this.context.app.loader.resources.statue0_eye2,
                        this.context.app.loader.resources.statue0_eye3,
                        this.context.app.loader.resources.statue0_eye4,
                    ],
                    ear: [
                        this.context.app.loader.resources.statue0_ear1,
                        this.context.app.loader.resources.statue0_ear2,
                        this.context.app.loader.resources.statue0_ear3,
                    ],
                },
            },
            {
                src: this.context.app.loader.resources.statue1,
                skin: [
                    this.context.app.loader.resources.statue1_skin1,
                    this.context.app.loader.resources.statue1_skin2,
                    this.context.app.loader.resources.statue1_skin3,
                ],
            },
            {
                src: this.context.app.loader.resources.statue2,
                skin: [
                    this.context.app.loader.resources.statue2_skin1,
                    this.context.app.loader.resources.statue2_skin2,
                    this.context.app.loader.resources.statue2_skin3,
                ],
            },
            {
                src: this.context.app.loader.resources.statue3,
                skin: [
                    this.context.app.loader.resources.statue3_skin1,
                    this.context.app.loader.resources.statue3_skin2,
                    this.context.app.loader.resources.statue3_skin3,
                ],
            },
        ],
    }

    render() {
        const statue = this.state.statues[this.props.no];
        return (
            <Container {...this.props}>
                <Sprite
                    anchor={[0.5, 1]}
                    texture={statue.skin[this.props.skin].texture} />
                {this.props.no===0 && // if user statue
                    <Fragment>
                        <Sprite
                            anchor={[0.5, 1]}
                            texture={statue.look.eye[this.props.eye].texture} />
                        <Sprite
                            anchor={[0.5, 1]}
                            texture={statue.look.hair[this.props.hair].texture} />
                        <Sprite
                            anchor={[0.5, 1]}
                            texture={statue.look.ear[this.props.skin].texture} />
                    </Fragment>
                }
            </Container>
        )
    }
}
export default Statue;

Statue.contextTypes = {
    app: PropTypes.object,
};
