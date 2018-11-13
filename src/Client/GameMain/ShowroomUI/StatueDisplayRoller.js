import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import $ from 'jquery';
import Statue from 'Client/Components/Statue';
import { connect } from 'react-redux';

class StatueDisplayRoller extends Component {

    componentDidMount = () => {
        $(document).on('mousewheel DOMMouseScroll', (e) => {
            const E = e.originalEvent;
            if (E.detail) { // if firefox
                if(E.detail > 0) this.props.onMousewheel(1);
                else this.props.onMousewheel(-1);
            } else {
                if(E.wheelDelta < 0) this.props.onMousewheel(1);
                else this.props.onMousewheel(-1);
            };
        });
    }

    componentWillUnmount = () => $(document).off('mousewheel DOMMouseScroll');

    renderStatues = () => {
        let iterator = [];
        for(let i=0 ; i<=this.props.gameData.maxStatue ; i++) iterator.push(i);
        return iterator.map(i => {
            if(i === 0)  {
                return <Statue
                    key={i}
                    interactive
                    click={()=>this.props.onClickStatue(i)}
                    x={this.props.width/2 + i*this.props.gapBetweenStatues}
                    y={this.props.height}
                    no={0}
                    scale={1.4}
                    eye={this.props.userData.defaultStatueLook.eye}
                    hair={this.props.userData.defaultStatueLook.hair}
                    hpEquipLook={this.props.userData.statues[i].equip.hp.look}
                    atkEquipLook={this.props.userData.statues[i].equip.atk.look}
                    defEquipLook={this.props.userData.statues[i].equip.def.look} />
            }
            else if(i < this.props.userData.numStatues) {
                return <Statue
                    key={i}
                    interactive
                    click={()=>this.props.onClickStatue(i)}
                    x={this.props.width/2 + i*this.props.gapBetweenStatues}
                    y={this.props.height}
                    no={i}
                    scale={1.4}
                    hpEquipLook={this.props.userData.statues[i].equip.hp.look}
                    atkEquipLook={this.props.userData.statues[i].equip.atk.look}
                    defEquipLook={this.props.userData.statues[i].equip.def.look} />
            } else {
                return <Statue
                    key={i}
                    interactive
                    click={()=>this.props.onClickStatue(i)}
                    x={this.props.width/2 + i*this.props.gapBetweenStatues}
                    y={this.props.height}
                    no={i}
                    scale={1.4}
                    tint={0xFFFFFF}
                    hpEquipLook={0}
                    atkEquipLook={0}
                    defEquipLook={0} />
            }
        });
    }

    render() {
        return (
            <Container {...this.props}>
                {this.renderStatues()}
            </Container>
        );
    }
}

export default connect(
    state => ({
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
    }),
)(StatueDisplayRoller);