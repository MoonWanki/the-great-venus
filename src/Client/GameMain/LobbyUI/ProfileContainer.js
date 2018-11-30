import React, { Component } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import * as PIXI from 'pixi.js';
import Statue from 'Client/Components/Statue';
import PercentageBar from 'Client/Components/PercentageBar';
import PropTypes from 'prop-types';

const textStyle = { fill: 0xffffff, fontSize: 14, fontFamily: ['Noto Sans KR', 'sans-serif'] };

class ProfileContainer extends Component {

    getMask = () => {
        let circle = new PIXI.Graphics();
        circle.clear();
        circle.beginFill(0x0);
        circle.drawCircle(54, 51, 63);
        circle.endFill();
        return circle;
    }

    getExpPercentage = () => ((this.props.userData.exp - this.props.userData.preRequiredExp) / (this.props.userData.requiredExp - this.props.userData.preRequiredExp) * 100).toFixed(2);

    render() {
        const { userData } = this.props;
        const expPercentage = this.getExpPercentage();
        return (
            <Container {...this.props}>
                <Sprite
                    texture={this.context.app.loader.resources.profile_container.texture} />
                <Statue
                    x={-20}
                    y={-20}
                    no={0}
                    scale={0.7}
                    hair={userData.defaultStatueLook.hair}
                    eye={userData.defaultStatueLook.eye}
                    skin={userData.defaultStatueLook.skin}
                    hpEquipLook={userData.statues[0].equip.hp.look}
                    atkEquipLook={userData.statues[0].equip.atk.look}
                    defEquipLook={userData.statues[0].equip.def.look}
                    crtEquipLook={userData.statues[0].equip.crt.look}
                    avdEquipLook={userData.statues[0].equip.avd.look}
                    mask={this.getMask()}
                    anchor={[0, 0]} />
                <Text x={130} y={4} text={`Lv. ${userData.level}  ${userData.name}`} style={{ ...textStyle, fontSize: 16 }} />
                <PercentageBar color={0xe2b010} x={132} y={25} width={140} height={15} value={expPercentage} maxValue={100} />
                <Text anchor={[0.5, 0]} x={202} y={25} text={`${userData.exp}/${userData.requiredExp} (${expPercentage}%)`} style={{ ...textStyle, fontSize: 12, fontFamily: 'Nanum Gothic' }} />
                <Text anchor={[1, 0]} x={270} y={50} text={`${userData.sorbiote}`} style={textStyle} />
                <Text anchor={[1, 0]} x={270} y={83} text={`${this.props.finney.toLocaleString()}`} style={textStyle} />
            </Container>
        );
    }
}

export default connect(
    (state) => ({
        userData: state.userModule.userData,
        finney: state.userModule.finney
    })
)(ProfileContainer);

ProfileContainer.contextTypes = {
    app: PropTypes.object,
}