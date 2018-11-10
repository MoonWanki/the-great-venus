import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Animated from 'animated';
import Statue from '../Statue';

class Field extends Component {

    state = {
        stageNo: this.props.stageNo,
        statues: this.props.initialStatues,
        mobs: this.props.initialMobs,
        ourUnitsPosition: [
            new Animated.ValueXY({ x: this.props.width*20/50, y: this.props.height*9/10 }),
            new Animated.ValueXY({ x: this.props.width*21/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*17/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*16/50, y: this.props.height*9/10 }),
            new Animated.ValueXY({ x: this.props.width*13/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*12/50, y: this.props.height*9/10 }),
        ],
        enemyUnitsPosition: [
            new Animated.ValueXY({ x: this.props.width*30/50, y: this.props.height*9/10 }),
            new Animated.ValueXY({ x: this.props.width*29/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*33/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*34/50, y: this.props.height*9/10 }),
            new Animated.ValueXY({ x: this.props.width*37/50, y: this.props.height*8/10 }),
            new Animated.ValueXY({ x: this.props.width*38/50, y: this.props.height*9/10 }),
        ]
    }

    componentDidMount = () => {
        console.log(this.props.initialStatues, this.props.initialMobs, this.props.roundResult);
    }

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    runBattle = () => {
        this.props.roundResult.attackList.map(async attack => {
            await this.sleep(400);
            console.log(attack);
        })
        this.props.onFinish();
    }

    renderOurUnits = () => {
        this.props.isColosseum
        ? this.props.initialStatues.map((unit, i) => {
        })
        : this.props.initialStatues.map((unit, i) => {
            
        })
    }

    renderEnemyUnits = () => {

    }

    render() {
        const { width, height } = this.props;
        return (
            <Container alpha={this.props.offset}>
                {this.renderOurUnits()}
                {this.renderEnemyUnits()}
                {/* <FlatButton
                    x={width/2}
                    y={height - 100}
                    width={180}
                    height={36}
                    text='OK'
                    onClick={this.props.onFinish} /> */}
            </Container>
        );
    }
}

export default Field;