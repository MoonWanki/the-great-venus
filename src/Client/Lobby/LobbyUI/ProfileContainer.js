import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import Box from 'Client/Components/Box';

class ProfileContainer extends Component {
    render() {
        const { width, height, userData } = this.props;
        return (
            <Container {...this.props}>
                <Box
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.25} />
                <Text y={0} text={`Lv. ${userData.level} ${userData.name}`} style={{ fill: 0xffffff, fontSize: 14 }} />
                <Text y={height/3} text={`영혼의 결정 ${userData.soul}개`} style={{ fill: 0xffffff, fontSize: 14 }} />
                <Text y={height*2/3} text={`이더리움 ${this.props.finney.toLocaleString()} FINNEY`} style={{ fill: 0xffffff, fontSize: 14 }} />
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