import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from 'store/modules/adminModule';
import * as userActions from 'store/modules/userModule';
import { Table, Navbar, NavItem, Input, Row, Button } from 'react-materialize';
import './AdminPage.scss';

class AdminPage extends Component {

    state = {
        statueInfoForm: {
            hp: '',
            atk: '',
            def: '',
            crt: '',
            avd: '',
            whatNo: '',
        },
        mobInfoForm: {
            hp: '',
            atk: '',
            def: '',
            crt: '',
            avd: '',
            whatNo: '',
        },
        requiredExpForm: {
            exp: '',
            whatLevel: '',
        },
    }


    componentDidMount() {
        setInterval(()=>{
            if(this.props.web3Instance) {
                this.props.UserActions.loadUserData(this.props.web3Instance);
                this.props.AdminActions.loadConfig(this.props.web3Instance);
            }
        }, 2000);
    }

    render() {
        const { web3Instance, AdminActions, UserActions, statueInfoList, mobInfoList, requiredExpList, userData, isLoaded } = this.props;
        const { statueInfoForm, mobInfoForm } = this.state;
        return (
            <Fragment>
                <Navbar brand='Test page' right className='blue-grey darken-3'>
                    <NavItem onClick={() => AdminActions.setConfigToDefault(web3Instance)}>Set to default</NavItem>
                </Navbar>
                <div className='admin-simulation'>
                    <div className='admin-simulation-segment'>
                        <Table>
                            <thead>
                                <tr>
                                    <th>내 정보</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>닉네임</td>
                                    <td>{userData.name ? userData.name : '-'}</td>
                                </tr>
                                <tr>
                                    <td>레벨</td>
                                    <td>{userData.level ? userData.level.c : '-'}</td>
                                </tr>
                                <tr>
                                    <td>경험치</td>
                                    <td>{userData.exp ? userData.exp.c : '-'}</td>
                                </tr>
                                <tr>
                                    <td>골드</td>
                                    <td>{userData.gold ? userData.gold.c : '-'}</td>
                                </tr>
                                <tr>
                                    <td>석상 개수</td>
                                    <td>{userData.lastStage ? userData.numStatue.c : '-'}</td>
                                </tr>
                                <tr>
                                    <td>완료 스테이지</td>
                                    <td>{userData.lastStage ? userData.lastStage.c : '-'}</td>
                                </tr>
                                <tr>
                                    <td>초기화</td>
                                    <th>
                                        <Button floating flat large className='teal darken-2' waves='light' icon='refresh' onClick={() => UserActions.createUser(web3Instance, 'Administator')} />
                                    </th>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    {userData.equipList ? userData.equipList.map((unit, i)=>{
                        return (
                            <div className='admin-simulation-segment' key={i}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>장비</th>
                                            <th>타입</th>
                                            <th>레벨</th>
                                            <th>강화</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>HP</td>
                                            <td>{unit.hpEquipType}</td>
                                            <td>{unit.hpEquipLevel}</td>
                                            <td>
                                                <Button floating flat className='teal lighten-2' waves='light' icon='gavel' onClick={()=>{
                                                    UserActions.upgradeEquip(web3Instance, i, 1);
                                                }} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>ATK</td>
                                            <td>{unit.atkEquipType}</td>
                                            <td>{unit.atkEquipLevel}</td>
                                            <td>
                                                <Button floating flat className='teal lighten-1' waves='light' icon='gavel' onClick={()=>{
                                                    UserActions.upgradeEquip(web3Instance, i, 2);
                                                }} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>DEF</td>
                                            <td>{unit.defEquipType}</td>
                                            <td>{unit.defEquipLevel}</td>
                                            <td>
                                                <Button floating flat className='teal' waves='light' icon='gavel' onClick={()=>{
                                                    UserActions.upgradeEquip(web3Instance, i, 3);
                                                }} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>CRT</td>
                                            <td>{unit.hpEquipType}</td>
                                        </tr>
                                        <tr>
                                            <td>AVD</td>
                                            <td>{unit.hpEquipType}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        );
                    }) : null}
                    
                </div>
                <div className='admin-stage-list'>
                <h5>스테이지 입장 </h5>
                    {userData.lastStage ? [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(i=>{
                        if(i <= userData.lastStage.c[0]) return(<div key={i} className='admin-stage-item' style={{ background: '#d19159', cursor: 'pointer' }} onClick={()=>UserActions.clearStage(web3Instance, i)}>{i}</div>)
                        else if(i === userData.lastStage.c[0] + 1) return(<div key={i} className='admin-stage-item' style={{ background: '#cc6c18', cursor: 'pointer', fontWeight: '700'}} onClick={()=>UserActions.clearStage(web3Instance, i)}>{i}</div>)
                        else return (<div key={i} className='admin-stage-item' style={{ background: '#777', color: '#999'}}>{i}</div>)
                    }) : null}
                </div>
                {isLoaded?
                <div>
                    <div className="admin-segment">
                        <p className="admin-segment-title">~ 석상 ~</p>
                        <Row>
                            <Input s={4} label="HP" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, hp: v}})} />
                            <Input s={2} label="ATK" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, atk: v}})} />
                            <Input s={2} label="DEF" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, def: v}})} />
                            <Input s={2} label="CRT" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, crt: v}})} />
                            <Input s={2} label="AVD" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, avd: v}})} />
                        </Row>
                        <Row>
                            <Input s={2} placeholder="몇" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, whatNo: v}})} />
                            번 석상을
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={()=>{
                                if(statueInfoForm.whatNo && statueInfoForm.hp && statueInfoForm.atk && statueInfoForm.def && statueInfoForm.crt && statueInfoForm.avd)
                                    AdminActions.editConfig(web3Instance, 'statue', statueInfoForm);
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
                            }} />
                            또는 신규 석상을
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={()=>{
                                if(statueInfoForm.hp && statueInfoForm.atk && statueInfoForm.def && statueInfoForm.crt && statueInfoForm.avd)
                                    AdminActions.addConfig(web3Instance, 'statue', statueInfoForm)
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);  
                            }} />
                        </Row>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>No.</th><th>HP</th><th>ATK</th><th>DEF</th><th>CRT</th><th>AVD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statueInfoList.map((unit, i) => <tr key={i}><th>{i+1}</th><td>{unit[0].c}</td><td>{unit[1].c}</td><td>{unit[2].c}</td><td>{unit[3].c}%</td><td>{unit[4].c}%</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                    <div className="admin-segment">
                        <p className="admin-segment-title">~ 몬스터 ~</p>
                        <Row>
                            <Input s={4} label="HP" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, hp: v}})} />
                            <Input s={2} label="ATK" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, atk: v}})} />
                            <Input s={2} label="DEF" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, def: v}})} />
                            <Input s={2} label="CRT" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, crt: v}})} />
                            <Input s={2} label="AVD" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, avd: v}})} />
                        </Row>
                        <Row>
                            <Input s={2} placeholder="몇" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, whatNo: v}})} />
                            번 몬스터를
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={()=>{
                                if(mobInfoForm.whatNo && mobInfoForm.hp && mobInfoForm.atk && mobInfoForm.def && mobInfoForm.crt && mobInfoForm.avd)
                                    AdminActions.editConfig(web3Instance, 'mob', mobInfoForm);
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
                            }} />
                            또는 신규 몬스터를
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={()=>{
                                if(mobInfoForm.hp && mobInfoForm.atk && mobInfoForm.def && mobInfoForm.crt && mobInfoForm.avd)
                                    AdminActions.addConfig(web3Instance, 'mob', mobInfoForm)
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);  
                            }} />
                        </Row>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>No.</th><th>HP</th><th>ATK</th><th>DEF</th><th>CRT</th><th>AVD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mobInfoList.map((unit, i) => <tr key={i}><th>{i+1}</th><td>{unit[0].c}</td><td>{unit[1].c}</td><td>{unit[2].c}</td><td>{unit[3].c}%</td><td>{unit[4].c}%</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                    <div className="admin-segment" style={{width: '220px'}}>
                        <p className="admin-segment-title">~ 요구 경험치 ~</p>
                        <Row>
                            <Input s={12} label="EXP" />
                        </Row>
                        <Row>
                            <Input s={3} placeholder="몇" />
                            레벨을
                            <Button floating flat className='amber' waves='light' icon='edit' />
                            or
                            <Button floating flat className='light-green' waves='light' icon='add' />
                        </Row>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>LEV</th><th>EXP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requiredExpList.map((unit, i) => <tr key={i}><th>{i+1}</th><td>{unit.c}</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                </div>
                :null}
            </Fragment>
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
        userData: state.userModule.userData,
    }),
    (dispatch) => ({
        AdminActions: bindActionCreators(adminActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(AdminPage);