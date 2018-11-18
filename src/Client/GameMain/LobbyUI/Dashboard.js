import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import { connect } from 'react-redux';

class Dashboard extends Component {
	render() {
		return (
			<Container {...this.props}>
				
			</Container>
		)
	}
}

export default connect(
    state => ({
        dashboardTextList: state.eventModule.dashboardTextList,
    })
)(Dashboard);
