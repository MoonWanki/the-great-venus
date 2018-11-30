import React, { Component, Fragment } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';
import PropTypes from 'prop-types';

const textStyle = {
    fill: 0xffffff,
    fontSize: 16,
    fontFamily: 'Nanum gothic',
};

const lookNames = {
    'HP': ['페도라', '리본장식모자', '스냅백'],
    'ATK': ['에메랄드 펜던트', '루비 펜던트', '사파이어 펜던트'],
    'DEF': ['체인 이어링', '하트장식 이어링', '블루문 이어링'],
}

const equipTypes = {
    'HP': '머리장식',
    'ATK': '펜던트',
    'DEF': '이어링',
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class EquipDisplay extends Component {

    state = {
        borderPointPosition: [
            new Animated.ValueXY({ x: 0, y: 0 }),
            new Animated.ValueXY({ x: this.props.width- 4, y: this.props.height*2/3 - 4 }),
        ]
    }

    equipIconTextures = {
        'HP': [
            this.context.app.loader.resources.icon_equip_hp1.texture,
            this.context.app.loader.resources.icon_equip_hp2.texture,
            this.context.app.loader.resources.icon_equip_hp3.texture,
        ],
        'ATK': [
            this.context.app.loader.resources.icon_equip_atk1.texture,
            this.context.app.loader.resources.icon_equip_atk2.texture,
            this.context.app.loader.resources.icon_equip_atk3.texture,
        ],
        'DEF': [
            this.context.app.loader.resources.icon_equip_def1.texture,
            this.context.app.loader.resources.icon_equip_def2.texture,
            this.context.app.loader.resources.icon_equip_def3.texture,
        ],
    }

    componentDidMount = () => {
        this.runBorderFX();
    }

    runBorderFX = async () => {
        while(true) {
            Animated.timing(this.state.borderPointPosition[0].y, { toValue: this.props.height*2/3 - 4, duration: 400 }).start();
            Animated.timing(this.state.borderPointPosition[1].y, { toValue: 0, duration: 400 }).start();
            await sleep(400);
            Animated.timing(this.state.borderPointPosition[0].x, { toValue: this.props.width - 4, duration: 600 }).start();
            Animated.timing(this.state.borderPointPosition[1].x, { toValue: 0, duration: 600 }).start();
            await sleep(600);
            Animated.timing(this.state.borderPointPosition[0].y, { toValue: 0, duration: 400 }).start();
            Animated.timing(this.state.borderPointPosition[1].y, { toValue: this.props.height*2/3 - 4, duration: 400 }).start();
            await sleep(400);
            Animated.timing(this.state.borderPointPosition[0].x, { toValue: 0, duration: 600 }).start();
            Animated.timing(this.state.borderPointPosition[1].x, { toValue: this.props.width - 4, duration: 600 }).start();
            await sleep(600);
        }
    }

    render() {
        const { isWorking, partName, message } = this.props;
        const { value, level, look } = this.props.equip;
        return (
            <Container {...this.props}>
                <Text y={-4} text={equipTypes[partName]} anchor={[0, 1]} style={{ ...textStyle, fontSize: 20, fontStyle: 'bold', fontFamily: 'Noto Sans KR' }} />
                <Container interactive>
                    <Box width={240} height={70} alpha={0.5} borderColor={0xFFFFFF} />
                    <Sprite
                        x={6} y={4}
                        texture={level ? this.equipIconTextures[partName][look - 1] : this.context.app.loader.resources.icon_equip_none.texture} />
                    <Text x={74} y={10} text={level ? `+${level} ${lookNames[partName][look - 1]}\n\n${partName} +${value}` : '장비를 장착하세요!'} style={textStyle}/>
                </Container>
                {level ? // 강화
                    <FlatButton
                        scale={0.8}
                        disabled={isWorking}
                        texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long_hover.texture]}
                        x={120} y={110}
                        text={isWorking ? message : '강화'}
                        onClick={this.props.onUpgradeEquip} />
                : isWorking ?
                    <FlatButton
                        scale={0.8}
                        disabled
                        texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long_hover.texture]}
                        x={120} y={110}
                        text={message} />
                    : <Fragment>
                        <FlatButton
                            x={30} y={110}
                            texture={[this.equipIconTextures[partName][0], this.equipIconTextures[partName][0]]}
                            onClick={() => this.props.onBuyEquip(1)} />
                        <FlatButton
                            x={120} y={110}
                            texture={[this.equipIconTextures[partName][1], this.equipIconTextures[partName][1]]}
                            onClick={() => this.props.onBuyEquip(2)} />
                        <FlatButton
                            x={210} y={110}
                            texture={[this.equipIconTextures[partName][2], this.equipIconTextures[partName][2]]}
                            onClick={() => this.props.onBuyEquip(3)} />
                    </Fragment>
                }
            </Container>
        );
    }
}

export default EquipDisplay;

EquipDisplay.contextTypes = {
    app: PropTypes.object,
}