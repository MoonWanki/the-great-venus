import React, { Component, Fragment } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from "pixi.js";

const Triangle = CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, newProps) => {
        const { color, x, y } = newProps;
        instance.clear();
        instance.beginFill(color||0x0);
        instance.moveTo(x, y);
        instance.lineTo(x, y + 16);
        instance.lineTo(x + 16, y);
        instance.lineTo(x, y);
        instance.endFill();
    },
}, 'Triangle');

const textStyle = {
    fill: 0xFFFFFF,
    fontSize: 15,
    fontFamily: 'Noto Sans KR',
}

class Leaderboard extends Component {

    renderUserList = () => {
        const { width } = this.props;
        return this.props.leaderboard.map((user, i) => {
            if(user.level===0) return null;
            let color;
            switch(this.getTier(user.rank)) {
                case 'diamond': color = 0xc1d5f2; break;
                case 'platinum': color = 0xa3ded2; break;
                case 'gold': color = 0xf1cf58; break;
                case 'silver': color = 0xa8a8a8; break;
                case 'bronze': color = 0xa8866d; break;
                default: break;
            }
            return <Container key={i}>
                <Box y={i*60} width={width} height={53} alpha={0.7} borderColor={color}/>
                <Text anchor={[0, 0.5]} x={30} y={27 + i*60} text={`${user.rank}위`} style={textStyle} />
                <Text anchor={[0, 0.5]} x={80} y={27 + i*60} text={`Lv.${user.level}  ${user.name}`} style={textStyle} />
                <Triangle color={color} x={0} y={i*60} />
                {user.rank < this.props.userData.rank && <Fragment>
                    <FlatButton
                        x={422} y={28 + i*60}
                        texture={[this.context.app.loader.resources.icon_info.texture, this.context.app.loader.resources.icon_info_hover.texture]}
                        onClick={()=>this.props.onCompareSpec(i)} />
                    <FlatButton
                        x={472} y={28 + i*60}
                        texture={[this.context.app.loader.resources.icon_match.texture, this.context.app.loader.resources.icon_match_hover.texture]}
                        onClick={()=>this.props.onFight(i)} />
                </Fragment>}
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
            <Container {...this.props}>
                {this.renderUserList()}
                {this.props.isUpdating && <Container interactive>
                    <Box width={width} height={height} alpha={0.7} borderColor={0xFFFFFF} />
                    <Text text={'업데이트 중입니다...'} style={{ ...textStyle, align: 'center' }} anchor={[0.5, 0.5]} x={width/2} y={height/2} />
                </Container> }
            </Container>
        );
    }
}

export default connect(
    state => ({
        userData: state.userModule.userData,
    }),
)(Leaderboard);

Leaderboard.contextTypes = {
    app: PropTypes.object,
}