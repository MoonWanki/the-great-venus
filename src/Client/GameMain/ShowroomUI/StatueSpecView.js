import React, { Component } from 'react';
import { Container, Text, Sprite } from 'react-pixi-fiber';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const textStyle = {
    fill: 0xffffff,
    fontSize: 16,
    fontStyle: 'bold',
    fontFamily: ['Noto Sans KR', 'sans-serif'],
}

class StatueSpecView extends Component {
    render() {
        const { currentSelectedStatue, userData } = this.props;
        const statue = userData.numStatues > currentSelectedStatue ? userData.statues[currentSelectedStatue] : null;
        return (
            <Container {...this.props}>
                <Sprite anchor={[0.5, 0.5]} texture={this.context.app.loader.resources.statue_spec_view.texture}/>
                <Text anchor={[0, 0.5]} position={[-60, -50]} text='HP' style={{ ...textStyle, align: 'left' }} />
                <Text anchor={[1, 0.5]} position={[60, -50]} text={statue ? this.props.userData.statues[this.props.currentSelectedStatue].hp : '???'} style={{ ...textStyle, align: 'right' }} />
                <Text anchor={[0, 0.5]} position={[-60, -25]} text='ATK' style={{ ...textStyle, align: 'left' }} />
                <Text anchor={[1, 0.5]} position={[60, -25]} text={statue ? this.props.userData.statues[this.props.currentSelectedStatue].atk : '???'} style={{ ...textStyle, align: 'right' }} />
                <Text anchor={[0, 0.5]} position={[-60, 0]} text='DEF' style={{ ...textStyle, align: 'left' }} />
                <Text anchor={[1, 0.5]} position={[60, 0]} text={statue ? this.props.userData.statues[this.props.currentSelectedStatue].def : '???'} style={{ ...textStyle, align: 'right' }} />
                <Text anchor={[0, 0.5]} position={[-60, 25]} text='CRT' style={{ ...textStyle, align: 'left' }} />
                <Text anchor={[1, 0.5]} position={[60, 25]} text={statue ? this.props.userData.statues[this.props.currentSelectedStatue].crt + '%' : '???'} style={{ ...textStyle, align: 'right' }} />
                <Text anchor={[0, 0.5]} position={[-60, 50]} text='AVD' style={{ ...textStyle, align: 'left' }} />
                <Text anchor={[1, 0.5]} position={[60, 50]} text={statue ? this.props.userData.statues[this.props.currentSelectedStatue].avd + '%' : '???'} style={{ ...textStyle, align: 'right' }} />
            </Container>
        );
    }
}

export default connect(
    state => ({
        userData: state.userModule.userData,
    }),
)(StatueSpecView);

StatueSpecView.contextTypes = {
    app: PropTypes.object,
}