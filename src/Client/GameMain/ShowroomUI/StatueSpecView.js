import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import { connect } from 'react-redux';

class StatueSpecView extends Component {
    render() {
        const { currentSelectedStatue, userData } = this.props;
        const statue = userData.numStatues > currentSelectedStatue ? userData.statues[currentSelectedStatue] : null;
        return (
            <Container {...this.props}>
                <Box color={0x7c7974} width={this.props.width} height={this.props.height} alpha={1}/>
                <Text text={'HP: ' + (statue ? this.props.userData.statues[this.props.currentSelectedStatue].hp : '???')} x={30} y={20} style={{ fill: 0xffffff, fontSize: 16 }} />
                <Text text={'ATK: ' + (statue ? this.props.userData.statues[this.props.currentSelectedStatue].atk : '???')} x={30} y={50} style={{ fill: 0xffffff, fontSize: 16 }} />
                <Text text={'DEF: ' + (statue ? this.props.userData.statues[this.props.currentSelectedStatue].def : '???')} x={30} y={80} style={{ fill: 0xffffff, fontSize: 16 }} />
                <Text text={'CRT: ' + (statue ? this.props.userData.statues[this.props.currentSelectedStatue].crt + '%' : '???')} x={30} y={110} style={{ fill: 0xffffff, fontSize: 16 }} />
                <Text text={'AVD: ' + (statue ? this.props.userData.statues[this.props.currentSelectedStatue].avd + '%' : '???')} x={30} y={140} style={{ fill: 0xffffff, fontSize: 16 }} />
            </Container>
        );
    }
}

export default connect(
    state => ({
        userData: state.userModule.userData,
    }),
)(StatueSpecView);