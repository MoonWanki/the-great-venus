import React, { Component, Fragment } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const textStyle = {
    fill: 0xFFFFFF,
    fontSize: 15,
    fontFamily: 'Noto Sans KR',
}

class RewardDisplay extends Component {

    trophyTextures = {
        'Diamond': this.context.app.loader.resources.trophy_diamond.texture,
        'Platinum': this.context.app.loader.resources.trophy_platinum.texture,
        'Gold': this.context.app.loader.resources.trophy_gold.texture,
        'Silver': this.context.app.loader.resources.trophy_silver.texture,
        'Bronze': this.context.app.loader.resources.trophy_bronze.texture,
    }

    getTier = rank => {
        const { cutForDiamond, cutForPlatinum, cutForGold, cutForSilver } = this.props.colosseumInfo;
        if(rank <= cutForDiamond) return 'Diamond';
        else if(rank <= cutForPlatinum) return 'Platinum';
        else if(rank <= cutForGold) return 'Gold';
        else if(rank <= cutForSilver) return 'Silver';
        else return 'Bronze';
    }

    getTierColor = rankName => {
        switch(rankName) {
            case 'Diamond': return 0xc1d5f2;
            case 'Platinum': return 0xa3ded2;
            case 'Gold': return 0xf1cf58;
            case 'Silver': return 0xa8a8a8;
            case 'Bronze': return 0xa8866d;
            default: return;
        }
    }

    render() {
        const { width, height, userData, gameData, colosseumInfo } = this.props;
        const rankName = colosseumInfo ? this.getTier(userData.rank) : 'Bronze';
        return (
            <Container {...this.props}>
                <Box width={width} height={height} alpha={0.7} borderColor={0xFFFFFF} />
                <Sprite anchor={[0.5, 0.5]} x={width/2} texture={this.context.app.loader.resources.reward_display_title.texture} />
                {colosseumInfo && <Fragment>
                    <Sprite x={25} y={90} scale={0.62} texture={this.trophyTextures[rankName]} />
                    <Text x={200} y={140} style={{ ...textStyle, fontSize: 24 }} text={`종합 ${userData.rank}위`} />
                    <Text x={200} y={170} style={{ ...textStyle, fontStyle: 'bold', fontSize: 36, fill: this.getTierColor(rankName)}} text={rankName} />
                    {(rankName==='Diamond' || rankName==='Platinum' || rankName==='Gold') && <Fragment>
                        <Text
                            x={200} y={236}
                            style={{ ...textStyle, fontSize: 24 }}
                            text={`${this.props.refundTimeLeft} 후`} />
                        <Text
                            x={200} y={268}
                            style={{ ...textStyle, fontSize: 24 }}
                            text={`${this.props.colosseumInfo.quota[rankName.toLowerCase()]} FINNEY를 받습니다!`} />
                        </Fragment>}
                    <Box x={15} y={height-270} width={width-30} height={255} alpha={0.5} borderColor={0xFFFFFF} />
                    {gameData.numUsers >= 10 ? <Fragment>
                        <Text x={30} y={height-250} style={textStyle} text={`티어`} />
                        <Text x={180} y={height-250} style={textStyle} text={`배정 순위`} />
                        <Text x={320} y={height-250} style={textStyle} text={`1인당 보상 금액`} />
                        <Text x={30} y={height-215} style={{ ...textStyle, fontSize: 18, fill: this.getTierColor('Diamond'), fontStyle: 'bold' }} text={'Diamond'} />
                        <Text x={180} y={height-215} style={{ ...textStyle, fontSize: 18 }} text={`1위 ~ ${colosseumInfo.cutForDiamond}위`} />
                        <Text x={320} y={height-215} style={{ ...textStyle, fontSize: 18 }} text={colosseumInfo.quota.diamond + ' FINNEY'} />
                        <Text x={30} y={height-177} style={{ ...textStyle, fontSize: 18, fill: this.getTierColor('Platinum'), fontStyle: 'bold' }} text={'Platinum'} />
                        <Text x={180} y={height-177} style={{ ...textStyle, fontSize: 18 }} text={`${colosseumInfo.cutForDiamond + 1}위 ~ ${colosseumInfo.cutForPlatinum}위`} />
                        <Text x={320} y={height-177} style={{ ...textStyle, fontSize: 18 }} text={colosseumInfo.quota.platinum + ' FINNEY'} />
                        <Text x={30} y={height-139} style={{ ...textStyle, fontSize: 18, fill: this.getTierColor('Gold'), fontStyle: 'bold' }} text={'Gold'} />
                        <Text x={180} y={height-139} style={{ ...textStyle, fontSize: 18 }} text={`${colosseumInfo.cutForPlatinum + 1}위 ~ ${colosseumInfo.cutForGold}위`} />
                        <Text x={320} y={height-139} style={{ ...textStyle, fontSize: 18 }} text={colosseumInfo.quota.platinum + ' FINNEY'} />
                        <Text x={30} y={height-101} style={{ ...textStyle, fontSize: 18, fill: this.getTierColor('Silver'), fontStyle: 'bold' }} text={'Silver'} />
                        <Text x={180} y={height-101} style={{ ...textStyle, fontSize: 18 }} text={`${colosseumInfo.cutForGold + 1}위 ~ ${colosseumInfo.cutForSilver}위`} />
                        <Text x={320} y={height-101} style={{ ...textStyle, fontSize: 18 }} text={'-'} />
                        <Text x={30} y={height-63} style={{ ...textStyle, fontSize: 18, fill: this.getTierColor('Bronze'), fontStyle: 'bold' }} text={'Bronze'} />
                        <Text x={180} y={height-63} style={{ ...textStyle, fontSize: 18 }} text={`${colosseumInfo.cutForSilver + 1}위 ~ ${gameData.numUsers}위`} />
                        <Text x={320} y={height-63} style={{ ...textStyle, fontSize: 18 }} text={'-'} />
                    </Fragment> : <Text x={width/2} y={height-150} anchor={[0.5, 0]} style={textStyle} text={'총 유저 수가 10명 이상일 경우 환급이 진행됩니다.'} />}
                </Fragment>}
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
        userData: state.userModule.userData,
    }),
)(RewardDisplay);

RewardDisplay.contextTypes = {
    app: PropTypes.object,
}