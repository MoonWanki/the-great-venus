import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import * as web3Actions from 'store/modules/web3Module';
import { Table, NavItem, Input, Row, Button, Dropdown, Icon } from 'react-materialize';
import './AdminPage.scss';
import StageResultModal from './StageResultModal';
import * as TGVApi from 'utils/TGVApi';
import { Helmet } from 'react-helmet';

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
        nicknameForm: '',
        selectedAddress: null,
        networkVersion: null,
    }

    componentDidMount() {
        this.load();
    }

    load = async() => {
		try {
            const res = await this.props.Web3Actions.fetchWeb3();
            const web3 = res.value;
            await this.props.Web3Actions.fetchTGV(web3);
            this.update();
			web3.currentProvider.publicConfigStore.on('update', this.onPublicConfigUpdate);
		} catch (err) {
			console.error(err);
		}
    }

    update = async () => {
        this.loadGameData();
        this.loadMyData();
    }

    loadMyData = () => {
        this.props.UserActions.fetchUserData(this.props.TGV, this.props.web3.eth.coinbase);
    }

    loadGameData = () => {
        this.props.GameActions.fetchGameData(this.props.TGV);
    }

    onPublicConfigUpdate = ({ selectedAddress, networkVersion }) => {
        if(this.state.selectedAddress !== selectedAddress || this.state.networkVersion !== networkVersion) {
            this.setState({ selectedAddress: selectedAddress, networkVersion: networkVersion });
            this.update();
        }
    }

    createUser = async (name) => {
        if(name.length === 0) {
            window.Materialize.toast("닉네임을 설정해주세요!", 1500);
            return;
        }
        try {
            await this.props.TGV.createUser(name, [1, 3, 2], { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("유저 정보를 초기화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyHpEquip = async (statueNo, look) => {
        try {
            await this.props.TGV.buyHpEquip(statueNo, look, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.003, "ether") });
            window.Materialize.toast("장비를 장착합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyAtkEquip = async (statueNo, look) => {
        try {
            await this.props.TGV.buyAtkEquip(statueNo, look, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.005, "ether") });
            window.Materialize.toast("장비를 장착합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyDefEquip = async (statueNo, look) => {
        try {
            await this.props.TGV.buyDefEquip(statueNo, look, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.002, "ether") });
            window.Materialize.toast("장비를 장착합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyCrtEquip = async (statueNo, look) => {
        // try {
        //     await this.props.TGV.buyCrtEquip(statueNo, look, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.002, "ether") });
        //     window.Materialize.toast("장비를 장착합니다.", 1500);
        //     this.update();
        // } catch(err) {
        //     console.error(err);
        // }
    }

    buyAvdEquip = async (statueNo, look) => {
        // try {
        //     await this.props.TGV.buyCrtEquip(statueNo, look, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.002, "ether") });
        //     window.Materialize.toast("장비를 장착합니다.", 1500);
        //     this.update();
        // } catch(err) {
        //     console.error(err);
        // }
    }
    upgradeHpEquip = async (statueNo) => {
        try {
            await this.props.TGV.upgradeHpEquip(statueNo, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.0006, "ether") });
            window.Materialize.toast("장비를 강화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    upgradeAtkEquip = async (statueNo) => {
        try {
            await this.props.TGV.upgradeAtkEquip(statueNo, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.001, "ether") });
            window.Materialize.toast("장비를 강화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    upgradeDefEquip = async (statueNo) => {
        try {
            await this.props.TGV.upgradeDefEquip(statueNo, { from: this.props.web3.eth.coinbase, value: this.props.web3.toWei(0.0004, "ether") });
            window.Materialize.toast("장비를 강화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    upgradeCrtEquip = async (statueNo) => {
        // try {
        //     await this.props.TGV.upgradeDefEquip(statueNo, { from: this.props.web3.eth.coinbase });
        //     window.Materialize.toast("장비를 강화합니다.", 1500);
        //     this.update();
        // } catch(err) {
        //     console.error(err);
        // }
    }

    upgradeAvdEquip = async (statueNo) => {
        // try {
        //     await this.props.TGV.upgradeDefEquip(statueNo, { from: this.props.web3.eth.coinbase });
        //     window.Materialize.toast("장비를 강화합니다.", 1500);
        //     this.update();
        // } catch(err) {
        //     console.error(err);
        // }
    }

    clearStage = async (stageNo, units) => {
        try {
            const roundList = await TGVApi.clearStage(this.props.TGV, stageNo, units, this.props.web3.eth.coinbase);
            this.setState({
                stageResult: {
                    stageNo: stageNo,
                    roundList: roundList,
                    ally: units.map(i=>this.props.userData.statues[i]),
                    enemyList: this.props.gameData.stageInfoList[stageNo - 1].map(roundInfo => {
                        return roundInfo.filter(mobIdx => mobIdx > 0).map(mobIdx => {
                            return this.props.gameData.mobInfoList[mobIdx-1];
                        })
                    })
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
            await this.props.TGV.addStatueInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("석상 정보를 추가합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editStatueInfo = async (data) => {
        try {
            await this.props.TGV.editStatueInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("석상 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    addMobInfo = async (data) => {
        try {
            await this.props.TGV.addMobInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("몬스터 정보를 추가합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editMobInfo = async (data) => {
        try {
            await this.props.TGV.editMobInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("몬스터 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    renderStageButtons = () => {
        let stageButtons = [];
        const { lastStage } = this.props.userData;
        for(let i=1 ; i<=this.props.gameData.maxStage ; i++) {
            if(i === lastStage + 1) stageButtons.push(<div key={i} className='admin-stage-item' onClick={()=>this.clearStage(i, [0])} style={{ background: '#cc6c18', cursor: 'pointer' }} >{i}</div>);
            else if(i <= lastStage) stageButtons.push(<div key={i} className='admin-stage-item' onClick={()=>this.clearStage(i, [0])} style={{ background: '#d19159', cursor: 'pointer' }} >{i}</div>);
            else stageButtons.push(<div key={i} className='admin-stage-item' style={{ background: '#777', color: '#999'}}>{i}</div>);
        }
        return stageButtons;
    }

    render() {
        const { gameData, userData, isUserLoaded, isUserPending, isGameLoaded, isGamePending } = this.props;
        const { statueInfoForm, mobInfoForm } = this.state;
        return (
            <Fragment>

                <Helmet>
                    <title>TGV Test Page</title>
                    <meta name="description" content="The Great Venus test page" />
                </Helmet>
                
                <StageResultModal
                    open={this.state.stageResultModalOn}
                    stageResult={this.state.stageResult}
                    onClose={()=>this.setState({ stageResultModalOn: false })} />

                <div className='admin-navbar'>
                    <h5>USER</h5>
                    <div className='admin-navbar-button' onClick={this.loadMyData}><Icon>refresh</Icon></div>
                    <h6 className='admin-navbar-button'>{isUserPending && 'Loading...'}</h6>
                </div>
                
                { isUserLoaded ?
                    userData.level > 0 ?
                    <div className='admin-userdata'>
                        <div className='admin-userdata-segment' style={{ minWidth: '200px' }}>
                            <Table>
                                <thead><tr><th style={{ fontSize: '1.4rem'}}>My Info</th></tr></thead>
                                <tbody>
                                    <tr><td><h5>Lv.{userData.level}<br/>{userData.name}</h5></td></tr>
                                    <tr><td>경험치</td><td><b>{userData.exp}</b> / <b>{userData.requiredExp}</b> (<b>{userData.expPercentage}</b>%)</td></tr>
                                    <tr><td>GEM</td><td><b>{userData.gem}</b>개</td></tr>
                                    <tr>
                                        <td>초기화</td>
                                        <th>
                                            <Button floating flat large className='amber' waves='light' icon='refresh' onClick={()=>this.createUser(userData.name)} />
                                        </th>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        {userData.statues.map((statue, i)=>{
                            return (
                                <div className='admin-userdata-segment' key={i} style={{ minWidth: '300px' }}>
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
                                                <td>HP</td>
                                                <td><b>{statue.hp} {statue.equip.hp.level ? `(${statue.hpDefault} + ${statue.hpExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.hp.level}</b></td>
                                                <td>{statue.equip.hp.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeHpEquip(i)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyHpEquip(i, 1)}>중절모</NavItem>
                                                    <NavItem onClick={() => this.buyHpEquip(i, 2)}>텍사스카우보이모자</NavItem>
                                                    <NavItem onClick={() => this.buyHpEquip(i, 3)}>힙합 스냅백</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>ATK</td>
                                                <td><b>{statue.atk} {statue.equip.atk.level ? `(${statue.atkDefault} + ${statue.atkExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.atk.level}</b></td>
                                                <td>{statue.equip.atk.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeAtkEquip(i)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyAtkEquip(i, 1)}>루비 펜던트</NavItem>
                                                    <NavItem onClick={() => this.buyAtkEquip(i, 2)}>사파이어 펜던트</NavItem>
                                                    <NavItem onClick={() => this.buyAtkEquip(i, 3)}>에메랄드 펜던트</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>DEF</td>
                                                <td><b>{statue.def} {statue.equip.def.level ? `(${statue.defDefault} + ${statue.defExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.def.level}</b></td>
                                                <td>{statue.equip.def.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeDefEquip(i)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyDefEquip(i, 1)}>불멸의 오오라</NavItem>
                                                    <NavItem onClick={() => this.buyDefEquip(i, 2)}>냉기의 오오라</NavItem>
                                                    <NavItem onClick={() => this.buyDefEquip(i, 3)}>잿빛 오오라</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>CRT</td>
                                                <td><b>{statue.crt} {statue.equip.crt.level ? `(${statue.crtDefault} + ${statue.crtExtra})` : null} %</b></td>
                                                <td>Lv. <b>{statue.equip.crt.level}</b></td>
                                                <td>{statue.equip.crt.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>{
                                                        this.upgradeCrtEquip(i);
                                                    }} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyCrtEquip(i, 1)}>블루문 이어링</NavItem>
                                                    <NavItem onClick={() => this.buyCrtEquip(i, 2)}>해골 이어링</NavItem>
                                                    <NavItem onClick={() => this.buyCrtEquip(i, 3)}>합금도금 이어링</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>AVD</td>
                                                <td><b>{statue.avd} {statue.equip.avd.level ? `(${statue.avdDefault} + ${statue.avdExtra})` : null} %</b></td>
                                                <td>Lv. <b>{statue.equip.avd.level}</b></td>
                                                <td>{statue.equip.avd.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>{
                                                        this.upgradeAvdEquip(i);
                                                    }} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyAvdEquip(i, 1)}>네이비 페인트</NavItem>
                                                    <NavItem onClick={() => this.buyAvdEquip(i, 2)}>블루 페인트</NavItem>
                                                    <NavItem onClick={() => this.buyAvdEquip(i, 3)}>얼룩무늬 페인트</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            );
                        })}
                    </div>
                    :
                    <Fragment>
                        <div style={{height: '30px'}} />
                        <Row>
                            <Input s={6} label="Nickname" validate onChange={(e, v)=>this.setState({ nicknameForm: v })}/>
                            <Button floating large flat className='grey lighten-3' onClick={()=>this.createUser(this.state.nicknameForm)}>OK</Button>
                        </Row>
                    </Fragment>
                : '유저 정보를 불러올 수 없습니다.'}
                
                <div className='admin-navbar'>
                    <h5>STAGE</h5>
                </div>
                <div className='admin-stage-list'>
                    {isGameLoaded && isUserLoaded && userData.level ? this.renderStageButtons() : null}
                </div>

                <div className='admin-navbar'>
                    <h5>GAME</h5>
                    <div className='admin-navbar-button' onClick={this.loadGameData}><Icon>refresh</Icon></div>
                    <h6 className='admin-navbar-button'>{isGamePending && 'Loading...'}</h6>
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
                : '게임 정보를 불러올 수 없습니다.'}
            </Fragment>
        );
    }
}

export default connect(
    (state) => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        userData: state.userModule.userData,
        isUserPending: state.userModule.isPending,
        isUserLoaded: state.userModule.isLoaded,
        gameData: state.gameModule.gameData,
        isGamePending: state.gameModule.isPending,
        isGameLoaded: state.gameModule.isLoaded,
        selectedAddress: state.web3Module.selectedAddress,
        networkVersion: state.web3Module.networkVersion,
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        Web3Actions: bindActionCreators(web3Actions, dispatch),
    })
)(AdminPage);