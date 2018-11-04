import React, { Component, Fragment } from 'react'
import { Sprite, Container } from 'react-pixi-fiber';
import PropTypes from 'prop-types';

class Statue extends Component {

    state = {
        statues: [
            {
                body: this.context.app.loader.resources.statue0_skin2,
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
                    ear: this.context.app.loader.resources.statue0_ear2,
                },
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                },
            },
            {
                body: this.context.app.loader.resources.statue0_skin2,
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                }
            },
            {
                body: this.context.app.loader.resources.statue0_skin3,
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                }
            },
            {
                body: this.context.app.loader.resources.statue0_skin1,
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                }
            },
            {
                body: this.context.app.loader.resources.statue0_skin2,
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                }
            },
            {
                body: this.context.app.loader.resources.statue0_skin3,
                equip: {
                    hp: [
                        this.context.app.loader.resources.statue0_equip_hp1,
                        this.context.app.loader.resources.statue0_equip_hp2,
                        this.context.app.loader.resources.statue0_equip_hp3,
                    ],
                    atk: [
                        this.context.app.loader.resources.statue0_equip_atk1,
                        this.context.app.loader.resources.statue0_equip_atk2,
                        this.context.app.loader.resources.statue0_equip_atk3,
                    ],
                    def: [
                        this.context.app.loader.resources.statue0_equip_def1,
                        this.context.app.loader.resources.statue0_equip_def2,
                        this.context.app.loader.resources.statue0_equip_def3,
                    ],
                }
            },
        ],
    }

    render() {
        const statue = this.state.statues[this.props.no];
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
                    tint={this.props.tint || 0xffffff}
                    anchor={[0.5, 1]}
                    texture={statue.body.texture} />
                {this.props.no===0 && // if user statue
                    <Fragment>
                        <Sprite
                            anchor={[0.5, 1]}
                            tint={this.props.tint || 0xffffff}
                            texture={statue.look.eye[this.props.eye].texture} />
                        <Sprite
                            anchor={[0.5, 1]}
                            tint={this.props.tint || 0xffffff}
                            texture={statue.look.hair[this.props.hair].texture} />
                        <Sprite
                            anchor={[0.5, 1]}
                            tint={this.props.tint || 0xffffff}
                            texture={statue.look.ear.texture} />
                    </Fragment>
                }
                {this.props.hpEquipLook > 0 && <Sprite
                    anchor={[0.5, 1]}
                    texture={statue.equip.hp[this.props.hpEquipLook - 1].texture} />}
                {this.props.atkEquipLook > 0 && <Sprite
                    anchor={[0.5, 1]}
                    texture={statue.equip.atk[this.props.atkEquipLook - 1].texture} />}
                {this.props.defEquipLook > 0 && <Sprite
                    anchor={[0.5, 1]}
                    texture={statue.equip.def[this.props.defEquipLook - 1].texture} />}
            </Container>
        )
    }
}
export default Statue;

Statue.contextTypes = {
    app: PropTypes.object,
};
