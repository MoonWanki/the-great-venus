import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from 'store/modules/adminModule';
import { Table, Navbar, NavItem, Icon } from 'react-materialize';
import './AdminPage.scss';

class AdminPage extends Component {

    componentDidMount() {
        if(this.props.web3Instance) {
            this.props.AdminActions.loadConfig(this.props.web3Instance);
        }
    }

    render() {
        let key1 = 0, key2 = 0, key3 = 0;
        const { web3Instance, AdminActions, statueInfoList, mobInfoList, requiredExpList, isLoading, isLoaded } = this.props;
        
        return (
            <div>
                <Navbar brand='관리자 페이지' right className='blue-grey darken-3'>
                    <NavItem onClick={() => AdminActions.setConfigToDefault(web3Instance)}>Set to default</NavItem>
                    <NavItem onClick={()=>AdminActions.loadConfig(web3Instance)}><Icon>refresh</Icon></NavItem>
                </Navbar>
                <div className="admin-segment">
                    {isLoaded?
                        <Table striped bordered>
                            <thead>
                                <tr>
                                <th>LEV</th>
                                <th>HP</th>
                                <th>ATK</th>
                                <th>DEF</th>
                                <th>CRT</th>
                                <th>AVD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statueInfoList.map(unit => 
                                    <tr key={key1++}>
                                        <th>{key1}</th>
                                        <td>{unit[0].c}</td>
                                        <td>{unit[1].c}</td>
                                        <td>{unit[2].c}</td>
                                        <td>{unit[3].c}%</td>
                                        <td>{unit[4].c}%</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    :null}
                </div>
                <div className="admin-segment">
                    {isLoaded?
                        <Table striped bordered>
                            <thead>
                                <tr>
                                <th>LEV</th>
                                <th>HP</th>
                                <th>ATK</th>
                                <th>DEF</th>
                                <th>CRT</th>
                                <th>AVD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mobInfoList.map(unit => 
                                    <tr key={key2++}>
                                        <th>{key2}</th>
                                        <td>{unit[0].c}</td>
                                        <td>{unit[1].c}</td>
                                        <td>{unit[2].c}</td>
                                        <td>{unit[3].c}%</td>
                                        <td>{unit[4].c}%</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    :null}
                </div>
                <div className="admin-segment">
                    {isLoaded?
                        <Table striped bordered>
                            <thead>
                                <tr>
                                <th>LEV</th>
                                <th>EXP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requiredExpList.map(unit => 
                                    <tr key={key3++}>
                                        <th>{key3}</th>
                                        <td>{unit.c}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    :null}
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        isLoading: state.adminModule.isLoading,
        isLoaded: state.adminModule.isLoaded,
        statueInfoList: state.adminModule.statueInfoList,
        mobInfoList: state.adminModule.mobInfoList,
        stageInfoList: state.adminModule.stageInfoList,
        requiredExpList: state.adminModule.requiredExpList,
    }),
    (dispatch) => ({
        AdminActions: bindActionCreators(adminActions, dispatch)
    })
)(AdminPage);