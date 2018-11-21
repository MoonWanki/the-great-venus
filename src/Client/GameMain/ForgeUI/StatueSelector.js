import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
// import Statue from 'Client/Components/Statue';
import { connect } from 'react-redux';
// import * as PIXI from 'pixi.js';
import _ from 'lodash';

class StatueSelector extends Component {

    // renderThumbnails = () => _.times(this.props.gameData.maxStatue + 1, i => {
    //     let circle = new PIXI.Graphics();
    //     circle.clear();
    //     circle.beginFill(0x0);
    //     circle.drawCircle(
    //         this.props.x + (i%2 ? this.props.width*3/4 : this.props.width*1/4),
    //         this.props.y + 10 + Math.floor(i/2)*this.props.width/2,
    //         this.props.width/4
    //     );
    //     circle.endFill();
    //     if(i===0) {
    //         return <Statue
    //             key={i}
    //             no={0}
    //             x={this.props.width*1/4}
    //             y={300}
    //             mask={circle}
    //             interactive
    //             hair={this.props.userData.defaultStatueLook.hair}
    //             eye={this.props.userData.defaultStatueLook.eye}
    //             hpEquipLook={this.props.userData.statues[0].equip.hp.look}
    //             atkEquipLook={this.props.userData.statues[0].equip.atk.look}
    //             defEquipLook={this.props.userData.statues[0].equip.def.look}
    //             click={()=>this.props.onClickStatue(0)} />     
    //     } else if(i < this.props.userData.numStatues) {
    //         return <Statue
    //             key={i}
    //             no={i}
    //             x={i%2 ? this.props.width*3/4 : this.props.width*1/4}
    //             y={300 + Math.floor(i/2)*this.props.width/2}
    //             mask={circle}
    //             interactive
    //             hpEquipLook={this.props.userData.statues[i].equip.hp.look}
    //             atkEquipLook={this.props.userData.statues[i].equip.atk.look}
    //             defEquipLook={this.props.userData.statues[i].equip.def.look}
    //             click={()=>this.props.onClickStatue(i)} />     
    //     } else {
    //         return <FlatButton key={i} x={10 + (i%2 ? this.props.width/2 : 0)} y={10 + Math.floor(i/2)*this.props.width/2} width={this.props.width/2 - 20} height={this.props.width/2 - 20} text={'?'} />
    //     }
    // });

    renderThumbnails = () => _.times(this.props.gameData.maxStatue + 1, i => {
        if(i===0) {
            return <FlatButton key={i} x={10} y={10} width={this.props.width/2 - 20} height={this.props.width/2 - 20} text={i} onClick={()=>this.props.onClickStatue(i)} />     
        } else if(i < this.props.userData.numStatues) {
            return <FlatButton key={i} x={10 + (i%2 ? this.props.width/2 : 0)} y={10 + Math.floor(i/2)*this.props.width/2} width={this.props.width/2 - 20} height={this.props.width/2 - 20} text={i} onClick={()=>this.props.onClickStatue(i)} />     
        } else {
            return <FlatButton key={i} x={10 + (i%2 ? this.props.width/2 : 0)} y={10 + Math.floor(i/2)*this.props.width/2} width={this.props.width/2 - 20} height={this.props.width/2 - 20} text={'?'} />
        }
    });

    render() {
        const { x, y, width, height } = this.props;
        return (
            <Container x={x} y={y} width={width} height={height} alpha={1}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.3} />
                {this.renderThumbnails()}
            </Container>
        );
    }
}

export default connect(
    state => ({
        userData: state.userModule.userData,
        gameData: state.gameModule.gameData,
    }),
)(StatueSelector);