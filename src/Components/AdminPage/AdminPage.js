import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from 'store/modules/adminModule';
import * as userActions from 'store/modules/userModule';
import { Table, Navbar, NavItem, Icon, Input, Row, Button } from 'react-materialize';
import './AdminPage.scss';

class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
    }

    componentDidMount() {
        setInterval(()=>{
            if(this.props.web3Instance) {
                this.props.AdminActions.loadConfig(this.props.web3Instance);
            }
        }, 1000);
    }

    render() {
        let key1 = 0, key2 = 0, key3 = 0;
        const { web3Instance, AdminActions, UserActions, statueInfoList, mobInfoList, requiredExpList, userData, isLoaded } = this.props;
        const { statueInfoForm, mobInfoForm } = this.state;
        
        return (
            <div>
                <Navbar brand='Test page' right className='blue-grey darken-3'>
                    <NavItem onClick={() => AdminActions.setConfigToDefault(web3Instance)}>Set to default</NavItem>
                    <NavItem onClick={() => {
                        AdminActions.loadConfig(web3Instance);
                        UserActions.loadUserData(web3Instance);
                    }}><Icon>refresh</Icon></NavItem>
                </Navbar>
                <div className='admin-simulation'>
                    <div className='admin-simulation-myinfo'>
                        <Table>
                        <thead>
                            <tr>
                                <th>내 정보</th>
                                <th>
                                    <Button className='red darken-4' waves='light' onClick={() => UserActions.createUser(web3Instance, 'Administator')}>초기화</Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>닉네임</td>
                                <td>{userData.name ? userData.name : '정보를 불러올 수 없습니다'}</td>
                            </tr>
                            <tr>
                                <td>레벨</td>
                                <td>{userData.level ? userData.level.c : '정보를 불러올 수 없습니다'}</td>
                            </tr>
                            <tr>
                                <td>경험치</td>
                                <td>{userData.exp ? userData.exp.c : '정보를 불러올 수 없습니다'}</td>
                            </tr>
                            <tr>
                                <td>골드</td>
                                <td>{userData.gold ? userData.gold.c : '정보를 불러올 수 없습니다'}</td>
                            </tr>
                            <tr>
                                <td>완료 스테이지</td>
                                <td>{userData.lastStage ? userData.lastStage.c : '정보를 불러올 수 없습니다'}</td>
                            </tr>
                        </tbody>
                        </Table>
                    </div>
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
                                {statueInfoList.map(unit => <tr key={key1++}><th>{key1}</th><td>{unit[0].c}</td><td>{unit[1].c}</td><td>{unit[2].c}</td><td>{unit[3].c}%</td><td>{unit[4].c}%</td></tr>)}
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
                                {mobInfoList.map(unit => <tr key={key2++}><th>{key2}</th><td>{unit[0].c}</td><td>{unit[1].c}</td><td>{unit[2].c}</td><td>{unit[3].c}%</td><td>{unit[4].c}%</td></tr>)}
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
                                {requiredExpList.map(unit => <tr key={key3++}><th>{key3}</th><td>{unit.c}</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                </div>
                :"정보를 불러오지 못했습니다. 우측 상단의 새로고침을 눌러주세요."}
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
        userData: state.userModule.userData,
    }),
    (dispatch) => ({
        AdminActions: bindActionCreators(adminActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(AdminPage);