import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Statue from './Statue';
import Mob from './Mob';
import PercentageBar from './PercentageBar';
import PropTypes from 'prop-types';

class BattleUnit extends Component {

    state = {
        count: 0,
        unitScale: { x: 1, y: 1 },
    }

    componentDidMount = () => {
        if(this.props.isMob) this.context.app.ticker.add(this.animate);
    }

    componentWillUnmount() {
        if(this.props.isMob) this.context.app.ticker.remove(this.animate);
    }

    animate = () => {
        if(this.props.data.hp > 0) {
            this.setState(state => ({
                count: state.count + 0.15,
                unitScale: {
                    x: 1 + Math.sin(state.count) * 0.02,
                    y: 1 + Math.cos(state.count) * 0.02,
                }
            }));
        }
    }

    render() {
        return (
            <Container x={this.props.x} y={this.props.y} rotation={this.props.data.hp > 0 ? 0 : this.props.isEnemy ? 1.7 : -1.7}>
                {this.props.isMob
                ? <Mob
                    scale={this.state.unitScale}
                    no={this.props.data.no} />
                : <Statue
                    no={this.props.data.no}
                    skin={1}
                    eye={this.props.eye}
                    hair={this.props.hair}
                    hpEquipLook={this.props.hpEquipLook}
                    atkEquipLook={this.props.atkEquipLook}
                    defEquipLook={this.props.defEquipLook} />
                }
                <PercentageBar color={0xFF0000} x={-60} y={-280} width={120} height={8} value={this.props.data.hp} maxValue={this.props.data.maxHp}/>
            </Container>
        );
    }
}

BattleUnit.contextTypes = {
    app: PropTypes.object,
};

export default BattleUnit;