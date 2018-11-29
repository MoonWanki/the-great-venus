import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
// import Statue from 'Client/Components/Statue';
import { connect } from 'react-redux';
// import * as PIXI from 'pixi.js';
import _ from 'lodash';

class StatueSelector extends Component {

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