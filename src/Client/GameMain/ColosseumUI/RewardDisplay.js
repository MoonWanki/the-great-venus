import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import { connect } from 'react-redux';

const textStyle = {
    fill: 0xFFFFFF,
    fontSize: 16,
    fontFamily: 'Nanum Gothic',
}

class RewardDisplay extends Component {

    render() {
        const { width, height } = this.props;
        return (
            <Container x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
                <Box width={width} height={height} alpha={0.7} borderColor={0xFFFFFF} />
                {this.props.colosseumInfo && <Container >
                    <Text style={textStyle} y={50} text={this.props.refundTimeLeft} />
                    <Text style={textStyle} y={150} text={'다이아몬드 티어 1인당 ' + this.props.colosseumInfo.quota.diamond + ' FINNEY'} />
                    <Text style={textStyle} y={200} text={'플레티넘 티어 1인당 ' + this.props.colosseumInfo.quota.platinum + ' FINNEY'} />
                    <Text style={textStyle} y={250} text={'골드 티어 1인당 ' + this.props.colosseumInfo.quota.gold + ' FINNEY'} />
                </Container>}
                {this.props.isUpdating && <Container interactive>
                    <Text style={{ ...textStyle, align: 'center' }} text='업데이트 중입니다...' anchor={[0.5, 0.5]} x={width/2} y={height/2} />
                </Container> }
            </Container>
        );
    }
}

export default connect(
    state => ({
        gameData: state.gameModule.gameData,
    }),
)(RewardDisplay);