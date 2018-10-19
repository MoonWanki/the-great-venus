import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from 'store/modules/adminModule';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import { Table, Navbar, NavItem, Input, Row, Button, Dropdown, Icon } from 'react-materialize';
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
                this.load();
            }
        }, 5000);
    }

    load = () => {
        this.props.UserActions.loadUserData(this.props.web3Instance);
        this.props.GameActions.loadGameData(this.props.web3Instance);
    }

    buyEquip = (unit, part, type) => {
        this.props.UserActions.buyEquip(this.props.web3Instance, unit, part, type);
    }

    upgradeEquip = (unit, part) => {
        this.props.UserActions.upgradeEquip(this.props.web3Instance, unit, part);
    }

    render() {
        const { web3Instance, AdminActions, UserActions, gameData, userData, isUserLoaded, isGameLoaded } = this.props;
        const { statueInfoForm, mobInfoForm } = this.state;
        return (
            <Fragment>
                
                <Navbar brand='Test page' right className='blue-grey darken-3'>
                    <NavItem onClick={() => AdminActions.setConfigToDefault(web3Instance)}>Set to default</NavItem>
                    <NavItem onClick={this.load}><Icon>refresh</Icon></NavItem>
                </Navbar>
                
                {isUserLoaded ?
                <div className='admin-userdata'>
                    <div className='admin-userdata-segment'>
                        <Table>
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '1.4rem'}}>내 정보</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>닉네임</td>
                                    <td>{userData.name}</td>
                                </tr>
                                <tr>
                                    <td>레벨</td>
                                    <td>{userData.level}</td>
                                </tr>
                                <tr>
                                    <td>경험치</td>
                                    <td>{userData.exp}</td>
                                </tr>
                                <tr>
                                    <td>골드</td>
                                    <td>{userData.gold}</td>
                                </tr>
                                <tr>
                                    <td>석상 개수</td>
                                    <td>{userData.numStatue}</td>
                                </tr>
                                <tr>
                                    <td>완료 스테이지</td>
                                    <td>{userData.lastStage}</td>
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
                    {userData.equipList.map((unit, i)=>{
                        return (
                            <div className='admin-userdata-segment' key={i}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: '1.4rem'}}>{i}</th>
                                            <th>타입</th>
                                            <th>레벨</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>HP</td>
                                            <td>{unit.hpEquipType ? unit.hpEquipType : '-'}</td>
                                            <td>{unit.hpEquipLevel ? unit.hpEquipLevel : null}</td>
                                            <td>{unit.hpEquipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>{
                                                    this.upgradeEquip(i, 1);
                                                }} />
                                                :
                                                <Dropdown trigger={
                                                    <Button floating flat className='lime accent-4' waves='light' icon='add_shopping_cart' />
                                                  }>
                                                  <NavItem onClick={() => this.buyEquip(i, 1, 1)}>중절모</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 1, 2)}>텍사스카우보이모자</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 1, 3)}>힙합 스냅백</NavItem>
                                                </Dropdown>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>ATK</td>
                                            <td>{unit.atkEquipType ? unit.atkEquipType : '-'}</td>
                                            <td>{unit.atkEquipLevel ? unit.atkEquipLevel : null}</td>
                                            <td>{unit.atkEquipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>{
                                                    this.upgradeEquip(i, 2);
                                                }} />
                                                :
                                                <Dropdown trigger={
                                                    <Button floating flat className='lime accent-4' waves='light' icon='add_shopping_cart' />
                                                  }>
                                                  <NavItem onClick={() => this.buyEquip(i, 2, 1)}>루비 펜던트</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 2, 2)}>사파이어 펜던트</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 2, 3)}>해골 펜던트</NavItem>
                                                </Dropdown>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>DEF</td>
                                            <td>{unit.defEquipType ? unit.defEquipType : '-'}</td>
                                            <td>{unit.defEquipLevel ? unit.defEquipLevel : null}</td>
                                            <td>{unit.defEquipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>{
                                                    this.upgradeEquip(i, 3);
                                                }} />
                                                :
                                                <Dropdown trigger={
                                                    <Button floating flat className='lime accent-4' waves='light' icon='add_shopping_cart' />
                                                  }>
                                                  <NavItem onClick={() => this.buyEquip(i, 3, 1)}>불멸의 오라</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 3, 2)}>냉기의 오라</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 3, 3)}>잿빛 오라</NavItem>
                                                </Dropdown>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>CRT</td>
                                            <td>{unit.crtEquipType ? unit.crtEquipType : '-'}</td>
                                            <td></td>
                                            <td>{unit.crtEquipType ?
                                                <Button floating icon='gavel' disabled />
                                                :
                                                <Dropdown trigger={
                                                    <Button floating flat className='lime accent-4' waves='light' icon='add_shopping_cart' />
                                                  }>
                                                  <NavItem onClick={() => this.buyEquip(i, 4, 1)}>블루문 이어링</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 4, 2)}>실버 이어링</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 4, 3)}>합금도금 이어링</NavItem>
                                                </Dropdown>
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>AVD</td>
                                            <td>{unit.avdEquipType ? unit.avdEquipType : '-'}</td>
                                            <td></td>
                                            <td>{unit.avdEquipType ?
                                                <Button floating icon='gavel' disabled />
                                                :
                                                <Dropdown trigger={
                                                    <Button floating flat className='lime accent-4' waves='light' icon='add_shopping_cart' />
                                                  }>
                                                  <NavItem onClick={() => this.buyEquip(i, 5, 1)}>네이비 페인트</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 5, 2)}>블루 페인트</NavItem>
                                                  <NavItem onClick={() => this.buyEquip(i, 5, 3)}>얼룩무늬 페인트</NavItem>
                                                </Dropdown>
                                            }</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        );
                    })}
                    
                </div>
                : '유저 정보를 불러오고 있습니다.'}
                
                <div className='admin-stage-list'>
                <h5>스테이지 입장 </h5>
                    {userData.lastStage ? [1,2,3,4,5,6,7,8,9,10].map(i=>{
                        if(i <= userData.lastStage) return(<div key={i} className='admin-stage-item' style={{ background: '#d19159', cursor: 'pointer' }} onClick={()=>UserActions.clearStage(web3Instance, i, [0])}>{i}</div>)
                        else if(i === userData.lastStage + 1) return(<div key={i} className='admin-stage-item' style={{ background: '#cc6c18', cursor: 'pointer', fontWeight: '700'}} onClick={()=>UserActions.clearStage(web3Instance, i, [0])}>{i}</div>)
                        else return (<div key={i} className='admin-stage-item' style={{ background: '#777', color: '#999'}}>{i}</div>)
                    }) : null}
                </div>

                {isGameLoaded?
                <div>
                    <div className="admin-gamedata-segment">
                        <p className="admin-gamedata-segment-title">~ 석상 ~</p>
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
                                {gameData.statueInfoList.map((unit, i) => <tr key={i}><th>{i}</th><td>{unit.hp}</td><td>{unit.atk}</td><td>{unit.def}</td><td>{unit.crt}%</td><td>{unit.avd}%</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                    <div className="admin-gamedata-segment">
                        <p className="admin-gamedata-segment-title">~ 몬스터 ~</p>
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
                                {gameData.mobInfoList.map((unit, i) => <tr key={i}><th>{i+1}</th><td>{unit.hp}</td><td>{unit.atk}</td><td>{unit.def}</td><td>{unit.crt}%</td><td>{unit.avd}%</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                    <div className="admin-gamedata-segment">
                        <p className="admin-gamedata-segment-title">~ 스테이지 ~</p>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>No.</th><th>Round 1</th><th>Round 2</th><th>Round 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameData.stageInfoList.map((stage, i) =>
                                <tr key={i}>
                                <th>{i+1}</th>
                                <td>{stage[0].map(no => (no!==0 ? no : '　') + ' ')}</td>
                                <td>{stage[1].map(no => (no!==0 ? no : '　') + ' ')}</td>
                                <td>{stage[2].map(no => (no!==0 ? no : '　') + ' ')}</td></tr>)}
                            </tbody>
                        </Table>
                    </div>
                </div>
                : '게임 정보를 불러오고 있습니다.'}
            </Fragment>
        );
    }
}

export default connect(
    (state) => ({
        web3Instance: state.web3Module.web3Instance,
        userData: state.userModule.userData,
        gameData: state.gameModule.gameData,
        isUserLoaded: state.userModule.isLoaded,
        isGameLoaded: state.gameModule.isLoaded,
    }),
    (dispatch) => ({
        AdminActions: bindActionCreators(adminActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
    })
)(AdminPage);