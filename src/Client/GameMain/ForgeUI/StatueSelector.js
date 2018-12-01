import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

class StatueSelector extends Component {

    renderThumbnails = () => _.times(this.props.gameData.maxStatue + 1, i => {
        if(i===0) {
            return <FlatButton
                key={i}
                x={this.props.width/2}
                y={50}
                text={this.props.userData.name}
                onClick={()=>this.props.onClickStatue(i)}
                texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long_hover.texture]} />     
        } else if(i < this.props.userData.numStatues) {
            return <FlatButton
                key={i}
                x={this.props.width/2}
                y={50 + i*80}
                text={this.props.userData.statues[i].name}
                onClick={()=>this.props.onClickStatue(i)}
                texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long_hover.texture]} />     
        } else {
            return <FlatButton
                key={i}
                x={this.props.width/2}
                y={50 + i*80}
                text={'???'}
                disabled
                texture={[this.context.app.loader.resources.btn_long.texture, this.context.app.loader.resources.btn_long.texture]} />
        }
    });

    render() {
        const { width, height } = this.props;
        return (
            <Container {...this.props}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.6}
                    borderColor={0xFFFFFF} />
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

StatueSelector.contextTypes = {
    app: PropTypes.object,
}