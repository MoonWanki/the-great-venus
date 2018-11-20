import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import * as PIXI from 'pixi.js';
import Statue from 'Client/Components/Statue';
import PercentageBar from 'Client/Components/PercentageBar';

const textStyle = { fill: 0xffffff, fontSize: 16, fontFamily: 'Nanum Gothic' };

class ProfileContainer extends Component {

    getMask = () => {
        let circle = new PIXI.Graphics();
        circle.clear();
        circle.beginFill(0x0);
        circle.drawCircle(40, 40, 40*Math.sqrt(2));
        circle.endFill();
        return circle;
    }

    getExpPercentage = () => ((this.props.userData.exp - this.props.userData.preRequiredExp) / (this.props.userData.requiredExp - this.props.userData.preRequiredExp) * 100).toFixed(2);

    render() {
        const { height, userData } = this.props;
        return (
            <Container {...this.props}>
                <Statue
                    x={-40}
                    y={-40}
                    no={0}
                    scale={0.7}
                    hair={userData.defaultStatueLook.hair}
                    eye={userData.defaultStatueLook.eye}
                    hpEquipLook={userData.statues[0].equip.hp.look}
                    atkEquipLook={userData.statues[0].equip.atk.look}
                    defEquipLook={userData.statues[0].equip.def.look}
                    mask={this.getMask()}
                    anchor={[0, 0]} />
                <Text x={90} text={`Lv. ${userData.level}  ${userData.name}`} style={{ ...textStyle, fontSize: 20 }} />
                <PercentageBar color={0xDDCC33} x={90} y={height*3/10} width={200} height={10} value={this.getExpPercentage()} maxValue={100} />
                <Text x={90} y={height*2/4} text={`소비오트 ${userData.sorbiote}개`} style={textStyle} />
                <Text x={90} y={height*3/4} text={`이더리움 ${this.props.finney.toLocaleString()} FINNEY`} style={textStyle} />
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