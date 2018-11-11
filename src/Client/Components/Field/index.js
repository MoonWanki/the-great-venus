import React, { Component } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import BattleUnit from '../BattleUnit';
import * as PIXI from 'pixi.js';

const AnimatedBattleUnit = Animated.createAnimatedComponent(BattleUnit);
const AnimatedText = Animated.createAnimatedComponent(Text);

const unitAttackMotionEasing = [
    Easing.linear,
    Easing.bezier(0, 0.8, 0.3, 1),
]

const ourUnitsPosition = [
    { x: 18/50, y: 17/20 },
    { x: 15/50, y: 15/20 },
    { x: 14/50, y: 17/20 },
    { x: 11/50, y: 15/20 },
    { x: 10/50, y: 17/20 },
    { x: 19/50, y: 15/20 },
];

const enemyUnitsPosition = [
    { x: 31/50, y: 15/20 },
    { x: 32/50, y: 17/20 },
    { x: 35/50, y: 15/20 },
    { x: 36/50, y: 17/20 },
    { x: 39/50, y: 15/20 },
    { x: 40/50, y: 17/20 },
]

class Field extends Component {

    state = {
        ourUnits: this.props.data.ourUnits.map(unit => ({
            ...unit,
            maxHp: unit.hp,
        })),
        enemyUnits: this.props.data.enemyUnits.map(unit => ({
            ...unit,
            maxHp: unit.hp,
        })),
        ourUnitsPosition: [
            new Animated.ValueXY(ourUnitsPosition[0]),
            new Animated.ValueXY(ourUnitsPosition[1]),
            new Animated.ValueXY(ourUnitsPosition[2]),
            new Animated.ValueXY(ourUnitsPosition[3]),
            new Animated.ValueXY(ourUnitsPosition[4]),
            new Animated.ValueXY(ourUnitsPosition[5]),
        ],
        enemyUnitsPosition: [
            new Animated.ValueXY(enemyUnitsPosition[0]),
            new Animated.ValueXY(enemyUnitsPosition[1]),
            new Animated.ValueXY(enemyUnitsPosition[2]),
            new Animated.ValueXY(enemyUnitsPosition[3]),
            new Animated.ValueXY(enemyUnitsPosition[4]),
            new Animated.ValueXY(enemyUnitsPosition[5]),
        ],
        damageView: {
            damage: 0,
            isCrt: false,
            offset: new Animated.Value(0),
            position: new Animated.ValueXY({ x: 0, y: 0 }),
        },
        mousePosition: new PIXI.Point(this.props.width/2, this.props.height/2),
    }

    componentDidMount = () => {
        setTimeout(this.runBattle, 1000);
    }

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    runBattle = async () => {
        for(let i=0 ; i<this.props.data.attackResultList.length ; i++) {
            const { way, from, to, damage, isCrt } = this.props.data.attackResultList[i];
            if(way) {
                Animated.timing(this.state.ourUnitsPosition[from], { toValue: enemyUnitsPosition[to], duration: 150, easing: unitAttackMotionEasing[0] }).start();
                await this.sleep(150);
                this.showDamage(damage, isCrt, enemyUnitsPosition[to]);
                this.setState({
                    enemyUnits: this.state.enemyUnits.map((unit, i)=>
                        i===to ? {...unit, hp: damage > unit.hp ? 0 : unit.hp - damage} : unit
                    )
                });
                if(this.state.enemyUnits[to].hp < damage) {
                    
                }
                Animated.timing(this.state.ourUnitsPosition[from], { toValue: ourUnitsPosition[from], duration: 850, easing: unitAttackMotionEasing[1] }).start();
                await this.sleep(850);
            } else {
                Animated.timing(this.state.enemyUnitsPosition[from], { toValue: ourUnitsPosition[to], duration: 150, easing: unitAttackMotionEasing[0] }).start();
                await this.sleep(150);
                this.showDamage(damage, isCrt, ourUnitsPosition[to]);
                this.setState({
                    ourUnits: this.state.ourUnits.map((unit, i)=>
                        i===to ? {...unit, hp: damage > unit.hp ? 0 : unit.hp - damage} : unit
                    )
                });
                Animated.timing(this.state.enemyUnitsPosition[from], { toValue: enemyUnitsPosition[from], duration: 850, easing: unitAttackMotionEasing[1] }).start();
                await this.sleep(850);
            }
        }
        this.props.onFinish();
    }

    showDamage = (damage, isCrt, position) => {
        this.setState({ damageView: { damage: damage, isCrt: isCrt, offset: new Animated.Value(1), position: new Animated.ValueXY({ x: position.x, y: position.y - 0.3 }) }});
        Animated.timing(this.state.damageView.offset, { toValue: 0 }).start();
        Animated.timing(this.state.damageView.position.y, { toValue: position.y - 0.32 }).start();
    }

    renderOurUnits = () => this.state.ourUnits.map((unit, i) => <AnimatedBattleUnit
        key={i}
        data={unit}
        x={this.state.ourUnitsPosition[i].x.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.width]})}
        y={this.state.ourUnitsPosition[i].y.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.height]})}
        eye={1}
        hair={1} />)
    
    renderEnemyUnits = () => this.props.isColosseum ?
        this.state.enemyUnits.map((unit, i) => <AnimatedBattleUnit
            key={i}
            data={unit}
            x={this.state.enemyUnitsPosition[i].x.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.width]})}
            y={this.state.enemyUnitsPosition[i].y.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.height]})}
            eye={1}
            hair={1} />)
        : this.state.enemyUnits.map((unit, i) => <AnimatedBattleUnit
            isMob
            key={i}
            data={unit}
            x={this.state.enemyUnitsPosition[i].x.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.width]})}
            y={this.state.enemyUnitsPosition[i].y.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.height]})} />)
    
    handleMouseMove = e => {
        this.setState({ mousePosition: e.data.global });
    }

    render() {
        const { width, height } = this.props;
        return (
            <Container
                interactive
                mousemove={this.handleMouseMove}
                alpha={this.props.offset}
                width={width}
                height={height}
                position={[
                    (this.state.mousePosition.x - width/2) * 0.005,
                    (this.state.mousePosition.y - height/2) * 0.005
                ]}>
                {this.renderOurUnits()}
                {this.renderEnemyUnits()}
                <AnimatedText
                    anchor={[0.5, 0.5]}
                    alpha={this.state.damageView.offset}
                    text={this.state.damageView.damage ? this.state.damageView.damage : 'MISS'}
                    x={this.state.damageView.position.x.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.width]})}
                    y={this.state.damageView.position.y.interpolate({ inputRange: [0, 1], outputRange: [0, this.props.height]})}
                    style={{
                        align: 'center',
                        fill: this.state.damageView.isCrt ? 0xFF0000 : 0xFFFFFF,
                        fontSize: this.state.damageView.isCrt ? 48 : 40,
                    }} />
            </Container>
        );
    }
}

export default Field;