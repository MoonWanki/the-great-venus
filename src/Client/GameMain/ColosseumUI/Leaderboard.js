import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';

class Leaderboard extends Component {

    renderUserList = () => {
        const { width, height } = this.props;
        return this.props.leaderboard.map((user, i) => {
            if(user.level===0) return null;
            let color;
            switch(this.getTier(user.rank)) {
                case 'diamond': color = 0xFBFDFF; break;
                case 'platinum': color = 0xd9f5f9; break;
                case 'gold': color = 0xFFD700; break;
                case 'silver': color = 0xC0C0C0; break;
                case 'bronze': color = 0x996515; break;
                default: break;
            }
            return <Container key={i}>
                <Box x={2} y={i*height/10 + 2} width={width} height={height/10 - 4} alpha={0.3} color={color}/>
                <Text x={2} y={i*height/10 + 2} text={user.rank} style={{ fill: 0xFFFFFF, fontSize: 16 }} />
                <Text x={width/3} y={i*height/10 + 2} text={`Lv.${user.level} ${user.name}`} style={{ fill: 0xFFFFFF, fontSize: 16 }} />
                <FlatButton x={width*4/6} y={i*height/10 + 2} width={width/6 - 2} height={height/10 - 4} text={'정보'} onClick={()=>this.props.onCompareSpec(i)} />
                <FlatButton x={width*5/6} y={i*height/10 + 2} width={width/6 - 2} height={height/10 - 4} text={'싸우자'} onClick={()=>this.props.onFight(i)} />
            </Container>
        })
    }

    getTier = rank => {
        const { cutForDiamond, cutForPlatinum, cutForGold, cutForSilver } = this.props.colosseumInfo;
        if(rank >= cutForDiamond) return 'diamond';
        else if(rank >= cutForPlatinum) return 'platinum';
        else if(rank >= cutForGold) return 'gold';
        else if(rank >= cutForSilver) return 'silver';
        else return 'bronze';
    }

    render() {
        const { width, height } = this.props;
        return (
            <Container x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
                <Box width={width} height={height} alpha={0.5} />
                {this.renderUserList()}
            </Container>
        );
    }
}

export default Leaderboard;