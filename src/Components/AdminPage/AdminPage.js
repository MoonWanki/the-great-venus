import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import * as web3Actions from 'store/modules/web3Module';
import { Table, Navbar, NavItem, Input, Row, Button, Dropdown, Icon } from 'react-materialize';
import './AdminPage.scss';
import StageResultModal from './StageResultModal';
import { getWeb3Instance, getTGVInstance } from 'utils/InstanceFactory';
import * as TGVApi from 'utils/TGVApi';

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
        stageResult: null,
        stageResultModalOn: false,
    }

    componentDidMount() {
        this.load();
    }

    load = async() => {
		try {
            const { web3Instance } = await getWeb3Instance();
            this.props.Web3Actions.fetchWeb3Instance(web3Instance);
            const TGVInstance = await getTGVInstance(web3Instance);
            this.props.Web3Actions.fetchTGVInstance(TGVInstance);
            this.update();
			web3Instance.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
		} catch (err) {
			console.log(err);
		}
    }

    update = async () => {
        this.props.GameActions.loadGameData(this.props.TGVInstance);
        this.props.UserActions.loadMyData(this.props.TGVInstance, this.props.web3Instance.eth.coinbase);
    }

    onPublicConfigUpdate = ({ selectedAddress, networkVersion }) => {
        if(this.props.selectedAddress !== selectedAddress) {
            this.props.Web3Actions.setSelectedAddress(selectedAddress);
            window.Materialize.toast(`${this.props.selectedAddress} -> ${selectedAddress}`, 2500);
        } else if(this.props.networkVersion !== networkVersion) {
            window.Materialize.toast(`${this.props.networkVersion} -> ${networkVersion}`, 2500);
        }
    }

    setToDefault = async () => {
        try {
            await this.props.TGVInstance.setToDefault({ from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast('사전 설정이 완료되었습니다.', 2500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    createUser = async (name) => {
        try {
            await this.props.TGVInstance.createUser(name, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("유저 정보를 초기화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyEquip = async (unit, part, type) => {
        try {
            await this.props.TGVInstance.buyEquip(unit, part, type, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("장비를 장착합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    upgradeEquip = async (unit, part) => {
        try {
            await this.props.TGVInstance.upgradeEquip(unit, part, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("장비를 강화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    clearStage = async (stageNo, units) => {
        try {
            const logs = await TGVApi.clearStage(this.props.TGVInstance, stageNo, units, this.props.web3Instance.eth.coinbase);
            this.setState({
                stageResult: {
                    stageNo: stageNo,
                    units: units,
                    logs: logs,
                },
                stageResultModalOn: true,
            })
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    addStatueInfo = async (data) => {
        try {
            await this.props.TGVInstance.addStatueInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("석상 정보를 추가합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editStatueInfo = async (data) => {
        try {
            await this.props.TGVInstance.editStatueInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("석상 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    addMobInfo = async (data) => {
        try {
            await this.props.TGVInstance.addMobInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("몬스터 정보를 추가합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editMobInfo = async (data) => {
        try {
            await this.props.TGVInstance.editMobInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3Instance.eth.coinbase });
            window.Materialize.toast("몬스터 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    renderStageButtons = () => {
        let stageButtons = [];
        const { lastStage } = this.props.userData;
        for(let i=1 ; i<=this.props.gameData.numStageInfo ; i++) {
            if(i === lastStage + 1) stageButtons.push(<div key={i} className='admin-stage-item' onClick={()=>this.clearStage(i, [0])} style={{ background: '#cc6c18', cursor: 'pointer', fontWeight: '700'}} >{i}</div>);
            else if(i <= lastStage) stageButtons.push(<div key={i} className='admin-stage-item' onClick={()=>this.clearStage(i, [0])} style={{ background: '#d19159', cursor: 'pointer' }} >{i}</div>);
            else stageButtons.push(<div key={i} className='admin-stage-item' style={{ background: '#777', color: '#999'}}>{i}</div>);
        }
        return stageButtons;
    }

    render() {
        const { gameData, userData, isUserLoaded, isGameLoaded } = this.props;
        const { statueInfoForm, mobInfoForm } = this.state;
        return (
            <Fragment>
                
                <StageResultModal open={this.state.stageResultModalOn} stageResult={this.state.stageResult} onClose={()=>this.setState({ stageResultModalOn: false })} />

                <Navbar brand='Test page' right className='blue-grey darken-3'>
                    <NavItem onClick={() => this.setToDefault()}>Set to default</NavItem>
                    <NavItem onClick={this.update}><Icon>refresh</Icon></NavItem>
                </Navbar>
                
                {isUserLoaded ?
                <div className='admin-userdata'>
                    <div className='admin-userdata-segment' style={{ width: '280px' }}>
                        <Table>
                            <thead><tr><th style={{ fontSize: '1.4rem'}}>내 정보</th></tr></thead>
                            <tbody>
                                <tr><td>닉네임</td><td>{userData.name}</td></tr>
                                <tr><td>레벨</td><td>{userData.level}</td></tr>
                                <tr><td>경험치</td><td>{userData.exp}</td></tr>
                                <tr><td>골드</td><td>{userData.gold}</td></tr>
                                <tr><td>석상 개수</td><td>{userData.numStatue}</td></tr>
                                <tr><td>완료 스테이지</td><td>{userData.lastStage}</td></tr>
                                <tr>
                                    <td>초기화</td>
                                    <th>
                                        <Button floating flat large className='teal darken-2' waves='light' icon='refresh' onClick={()=>this.createUser('Administator')} />
                                    </th>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    {userData.statue.map((statue, i)=>{
                        return (
                            <div className='admin-userdata-segment' key={i} style={{ width: '300px' }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: '1.4rem'}}>{i}</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><b>HP</b></td>
                                            <td>{`${statue.hp.default + statue.hp.extra} ${statue.hp.extra ? `(${statue.hp.default}+${statue.hp.extra})`:''}`}</td>
                                            <td>Lv. <b>{statue.hp.equipLevel}</b></td>
                                            <td>{statue.hp.equipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>this.upgradeEquip(i, 1)} />
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
                                            <td><b>ATK</b></td>
                                            <td>{`${statue.atk.default + statue.atk.extra} ${statue.atk.extra ? `(${statue.atk.default}+${statue.atk.extra})`:''}`}</td>
                                            <td>Lv. <b>{statue.atk.equipLevel}</b></td>
                                            <td>{statue.atk.equipLevel ?
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
                                            <td><b>DEF</b></td>
                                            <td>{`${statue.def.default + statue.def.extra} ${statue.def.extra ? `(${statue.def.default}+${statue.def.extra})`:''}`}</td>
                                            <td>Lv. <b>{statue.def.equipLevel}</b></td>
                                            <td>{statue.def.equipLevel ?
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
                                            <td><b>CRT</b></td>
                                            <td>{`${statue.crt.default + statue.crt.extra} ${statue.crt.extra ? `(${statue.crt.default}+${statue.crt.extra})`: ''}`}</td>
                                            <td>Lv. <b>{statue.crt.equipLevel}</b></td>
                                            <td>{statue.crt.equipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>{
                                                    this.upgradeEquip(i, 4);
                                                }} />
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
                                            <td><b>AVD</b></td>
                                            <td>{`${statue.avd.default + statue.avd.extra} ${statue.avd.extra ? `(${statue.avd.default}+${statue.avd.extra})`:''}`}</td>
                                            <td>Lv. <b>{statue.avd.equipLevel}</b></td>
                                            <td>{statue.avd.equipLevel ?
                                                <Button floating flat className='teal accent-4' waves='light' icon='gavel' onClick={()=>{
                                                    this.upgradeEquip(i, 5);
                                                }} />                                                :
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
                    {isGameLoaded && isUserLoaded ? this.renderStageButtons() : null}
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
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={async ()=>{
                                if(statueInfoForm.whatNo && statueInfoForm.hp && statueInfoForm.atk && statueInfoForm.def && statueInfoForm.crt && statueInfoForm.avd)
                                    this.editStatueInfo(statueInfoForm);
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
                            }} />
                            또는 신규 석상을
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={async ()=>{
                                if(statueInfoForm.hp && statueInfoForm.atk && statueInfoForm.def && statueInfoForm.crt && statueInfoForm.avd)
                                    this.addStatueInfo(statueInfoForm);
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
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={async ()=>{
                                if(mobInfoForm.whatNo && mobInfoForm.hp && mobInfoForm.atk && mobInfoForm.def && mobInfoForm.crt && mobInfoForm.avd)
                                    this.editMobInfo(mobInfoForm);
                                else
                                    window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
                            }} />
                            또는 신규 몬스터를
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={async ()=>{
                                if(mobInfoForm.hp && mobInfoForm.atk && mobInfoForm.def && mobInfoForm.crt && mobInfoForm.avd)
                                    this.addMobInfo(mobInfoForm);
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
        TGVInstance: state.web3Module.TGVInstance,
        userData: state.userModule.userData,
        gameData: state.gameModule.gameData,
        isUserLoaded: state.userModule.isLoaded,
        isGameLoaded: state.gameModule.isLoaded,
        isStageResultShowing: state.userModule.isStageResultShowing,
        stageResult: state.userModule.stageResult,
        selectedAddress: state.web3Module.selectedAddress,
        networkVersion: state.web3Module.networkVersion,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        Web3Actions: bindActionCreators(web3Actions, dispatch),
    })
)(AdminPage);