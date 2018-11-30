import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import PropTypes from 'prop-types';

class Leaderboard extends Component {

    renderUserList = () => {
        const { width } = this.props;
        return this.props.leaderboard.map((user, i) => {
            if(user.level===0) return null;
            let color;
            switch(this.getTier(user.rank)) {
                case 'diamond': color = 0xFBFDFF; break;
                case 'platinum': color = 0xb0f5f9; break;
                case 'gold': color = 0xFFD700; break;
                case 'silver': color = 0xC0C0C0; break;
                case 'bronze': color = 0x996515; break;
                default: break;
            }
            return <Container key={i}>
                <Box y={i*60} width={width} height={53} alpha={0.7} borderColor={color}/>
                <Text anchor={[0, 0.5]} x={10} y={27 + i*60} text={`${user.rank}위`} style={{ fill: 0xFFFFFF, fontSize: 16, fontFamily: 'Nanum Gothic' }} />
                <Text anchor={[0, 0.5]} x={60} y={27 + i*60} text={`Lv.${user.level} ${user.name}`} style={{ fill: 0xFFFFFF, fontSize: 16, fontFamily: 'Nanum Gothic' }} />
                <FlatButton
                    x={322} y={28 + i*60}
                    texture={[this.context.app.loader.resources.icon_info.texture, this.context.app.loader.resources.icon_info_hover.texture]}
                    onClick={()=>this.props.onCompareSpec(i)} />
                <FlatButton
                    x={372} y={28 + i*60}
                    texture={[this.context.app.loader.resources.icon_match.texture, this.context.app.loader.resources.icon_match_hover.texture]}
                    onClick={()=>this.props.onFight(i)} />
            </Container>
        })
    }

    getTier = rank => {
        const { cutForDiamond, cutForPlatinum, cutForGold, cutForSilver } = this.props.colosseumInfo;
        if(rank <= cutForDiamond) return 'diamond';
        else if(rank <= cutForPlatinum) return 'platinum';
        else if(rank <= cutForGold) return 'gold';
        else if(rank <= cutForSilver) return 'silver';
        else return 'bronze';
    }

    render() {
        const { width, height } = this.props;
        return (
            <Container x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
                {this.renderUserList()}
                {this.props.isUpdating && <Container interactive>
                    <Box width={width} height={height} alpha={0.7} borderColor={0xFFFFFF} />
                    <Text text={'업데이트 중입니다...'} style={{ fill: 0xFFFFFF, fontSize: 16, align: 'center', fontFamily: 'Nanum Gothic' }} anchor={[0.5, 0.5]} x={width/2} y={height/2} />
                </Container> }
            </Container>
        );
    }
}

export default Leaderboard;

Leaderboard.contextTypes = {
    app: PropTypes.object,
}