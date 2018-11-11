import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Statue from './Statue';
import Mob from './Mob';
import PercentageBar from './PercentageBar';

class BattleUnit extends Component {
    render() {
        return (
            <Container x={this.props.x} y={this.props.y} rotation={this.props.data.hp > 0 ? 0 : 1.8}>
                {this.props.isMob
                ? <Mob
                    no={this.props.data.no} />
                : <Statue
                    no={this.props.data.no}
                    skin={1}
                    eye={1}
                    hair={1} />
                }
                <PercentageBar color={0xFF0000} x={-60} y={-250} width={120} height={8} value={this.props.data.hp} maxValue={this.props.data.maxHp}/>
            </Container>
        );
    }
}

export default BattleUnit;