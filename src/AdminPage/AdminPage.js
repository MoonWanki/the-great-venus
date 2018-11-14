import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import * as web3Actions from 'store/modules/web3Module';
import { Table, NavItem, Input, Row, Button, Dropdown, Icon } from 'react-materialize';
import './AdminPage.scss';
import StageResultModal from './StageResultModal';
import PriceListModal from './PriceListModal';
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
            aquisitionStage: '',
        },
        mobInfoForm: {
            hp: '',
            atk: '',
            def: '',
            crt: '',
            avd: '',
            whatNo: '',
            exp: '',
        },
        roundInfoForm: {
            stageNo: '', roundNo: '',
            mob1: '', mob2: '', mob3: '', mob4: '', mob5: '',
        },
        requiredExpForm: {
            exp: '',
            whatLevel: '',
        },
        stageResult: null,
        stageResultModalOn: false,
        nicknameForm: 'Administrator',
        selectedAddress: null,
        networkVersion: null,
        equipConfig: null,
        priceListModalOn: false,
        statueForPriceList: 0,
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
            this.setState({ equipConfig: await TGVApi.getEquipConfig(this.props.TGV) });
            window.Materialize.toast("장비 레벨별 능력치 & 강화 요금표가 준비되었습니다!", 1500);
		} catch (err) {
			console.error(err);
		}
    }

    update = async () => {
        this.loadGameData();
        this.loadMyData();
        this.props.UserActions.fetchFinney(this.props.web3);
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
            window.Materialize.toast(name + "님 환영합니다!", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    toFinney = (bigNumber) => bigNumber.c[0]/10;

    buyEquip = async (statueNo, part, look) => {
        try {
            let fee = await this.props.TGV.basicFee.call();
            fee = this.toFinney(fee);
            window.Materialize.toast(fee + ' FINNEY를 지불합니다.', 2500);
            await this.props.TGV.buyEquip(statueNo, part, look, 0, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            window.Materialize.toast("장비를 장착합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    upgradeEquip = async (statueNo, part, currentLevel) => {
        try {
            let fee = await this.props.TGV.getUpgradeCost(statueNo, part, currentLevel);
            const soul = fee[0].c[0];
            fee = this.toFinney(fee[1]);
            if(soul > this.props.userData.soul) {
                window.Materialize.toast("영혼의 결정이 " + soul + "개 필요합니다.", 1500);
                return;
            }
            window.Materialize.toast("영혼의 결정 " + soul + "개와 " + fee + ' FINNEY를 지불합니다.', 2500);
            await this.props.TGV.upgradeEquip(statueNo, part, currentLevel, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            window.Materialize.toast("장비를 강화합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buyAura = async (statueNo, look, level) => {
        try {
            let price = await this.props.TGV.crtPrice.call();
            price = this.toFinney(price) * level;
            window.Materialize.toast(price + ' FINNEY를 지불합니다.', 2500);
            await this.props.TGV.buyEquip(statueNo, 4, look, level, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(price, 'finney')
            });
            window.Materialize.toast("오오라를 구매합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    buySkin = async (statueNo, look, level) => {
        try {
            let price = await this.props.TGV.avdPrice.call();
            price = this.toFinney(price) * level;
            window.Materialize.toast(price + ' FINNEY를 지불합니다.', 2500);
            await this.props.TGV.buyEquip(statueNo, 5, look, level, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(price, 'finney')
            });
            window.Materialize.toast("스킨을 구매합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
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

    increaseMaxStatue = async () => {
        try {
            await this.props.TGV.increaseMaxStatue({ from: this.props.web3.eth.coinbase });
            window.Materialize.toast("석고상 종류를 확장합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editStatueInfo = async (data) => {
        const { whatNo, hp, atk, def, crt, avd, aquisitionStage } = this.state.statueInfoForm;
        if(!whatNo || !hp || !atk || !def || !crt || !avd || !aquisitionStage) {
            window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
            return;
        }
        try {
            await this.props.TGV.editStatueInfo(whatNo, hp, atk, def, crt, avd, aquisitionStage, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("석고상 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    increaseMaxMob = async () => {
        try {
            await this.props.TGV.increaseMaxMob({ from: this.props.web3.eth.coinbase });
            window.Materialize.toast("몬스터 종류를 확장합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editMobInfo = async () => {
        const { whatNo, hp, atk, def, crt, avd, exp } = this.state.mobInfoForm;
        if(!whatNo || !hp || !atk || !def || !crt || !avd || !exp) {
            window.Materialize.toast('항목을 전부 입력해주세요!', 1500);
            return;
        }
        try {
            await this.props.TGV.editMobInfo(whatNo, hp, atk, def, crt, avd, exp, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("몬스터 정보를 변경합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    increaseMaxStage = async () => {
        try {
            await this.props.TGV.increaseMaxStage({ from: this.props.web3.eth.coinbase });
            window.Materialize.toast("스테이지를 확장합니다.", 1500);
            this.update();
        } catch(err) {
            console.error(err);
        }
    }

    editStageRoundInfo = async () => {
        const { stageNo, roundNo, mob1 } = this.state.roundInfoForm;
        if(!stageNo || !roundNo || !mob1) {
            window.Materialize.toast("올바르게 입력해주세요", 1500);
            return;
        }
        let mobNoList = [];
        for(let i=1 ; i<=5 ; i++) {
            const mobNo = this.state.roundInfoForm[`mob${i}`];
            if(mobNo) mobNoList.push(mobNo);
            else break;
        }        
        try {
            await this.props.TGV.editStageRoundInfo(stageNo, roundNo, mobNoList, { from: this.props.web3.eth.coinbase });
            window.Materialize.toast("스테이지 정보를 수정합니다.", 1500);
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
        const { statueInfoForm, mobInfoForm, roundInfoForm } = this.state;
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

                {this.state.equipConfig && gameData && <PriceListModal
                    open={this.state.priceListModalOn}
                    equipConfig={this.state.equipConfig}
                    statueNo={this.state.statueForPriceList}
                    basicFee={gameData.itemShopInfo.basicFee}
                    onClose={()=>this.setState({ priceListModalOn: false })} />}
               
                <div className='admin-navbar'>
                    <h5>USER</h5>
                    <div className='admin-navbar-button' onClick={this.loadMyData}><Icon>refresh</Icon></div>
                    <h6 className='admin-navbar-button'>{isUserPending && 'Loading...'}</h6>
                </div>
                
                { isUserLoaded ?
                    userData.level > 0 ?
                    <div className='admin-userdata'>
                        <div className='admin-userdata-segment' style={{ minWidth: '250px' }}>
                            <Table>
                                <thead><tr><th style={{ fontSize: '1.4rem'}}>My Info</th></tr></thead>
                                <tbody>
                                    <tr><td><h5>Lv.{userData.level}<br/>{userData.name}</h5></td></tr>
                                    <tr><td>EXP</td><td><b>{userData.exp}</b> / <b>{userData.requiredExp}</b> (<b>{userData.expPercentage}</b>%)</td></tr>
                                    <tr><td>영혼의 결정</td><td><b>{userData.soul}</b>개</td></tr>
                                    <tr><td>이더리움</td><td><b>{this.props.finney.toLocaleString()}</b> FINNEY</td></tr>
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
                                                <th><Button floating flat className='amber darken-3' waves='light' icon='format_list_numbered' onClick={()=>{
                                                    if(this.state.equipConfig)
                                                        this.setState({ statueForPriceList: i, priceListModalOn: true });
                                                    else window.Materialize.toast('수치를 계산 중입니다. 완료되면 알려드릴게요!', 1500);
                                                    }} /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>HP</td>
                                                <td><b>{statue.hp} {statue.equip.hp.level ? `(${statue.hpDefault} + ${statue.hpExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.hp.level}</b></td>
                                                <td>{statue.equip.hp.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeEquip(i, 1, statue.equip.hp.level)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyEquip(i, 1, 1)}>중절모</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 1, 2)}>텍사스카우보이모자</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 1, 3)}>힙합 스냅백</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>ATK</td>
                                                <td><b>{statue.atk} {statue.equip.atk.level ? `(${statue.atkDefault} + ${statue.atkExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.atk.level}</b></td>
                                                <td>{statue.equip.atk.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeEquip(i, 2, statue.equip.atk.level)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyEquip(i, 2, 1)}>루비 펜던트</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 2, 2)}>사파이어 펜던트</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 2, 3)}>에메랄드 펜던트</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>DEF</td>
                                                <td><b>{statue.def} {statue.equip.def.level ? `(${statue.defDefault} + ${statue.defExtra})` : null}</b></td>
                                                <td>Lv. <b>{statue.equip.def.level}</b></td>
                                                <td>{statue.equip.def.level ?
                                                    <Button floating flat className='amber darken-3' waves='light' icon='gavel' onClick={()=>this.upgradeEquip(i, 3, statue.equip.def.level)} />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyEquip(i, 3, 1)}>블루문 이어링</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 3, 2)}>해골 이어링</NavItem>
                                                    <NavItem onClick={() => this.buyEquip(i, 3, 3)}>합금도금 이어링</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>CRT</td>
                                                <td><b>{statue.crt} {statue.equip.crt.level ? `(${statue.crtDefault} + ${statue.crtExtra})` : null} %</b></td>
                                                <td></td>
                                                <td>{statue.equip.crt.level ?
                                                    <Button disabled floating flat className='amber darken-3' waves='light' icon='gavel' />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buyAura(i, 1, 1)}>불멸의 오오라 (+5%)</NavItem>
                                                    <NavItem onClick={() => this.buyAura(i, 2, 1)}>냉기의 오오라 (+5%)</NavItem>
                                                    <NavItem onClick={() => this.buyAura(i, 3, 2)}>다크 오오라 (+10%)</NavItem>
                                                    </Dropdown>
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>AVD</td>
                                                <td><b>{statue.avd} {statue.equip.avd.level ? `(${statue.avdDefault} + ${statue.avdExtra})` : null} %</b></td>
                                                <td></td>
                                                <td>{statue.equip.avd.level ?
                                                    <Button disabled floating flat className='amber darken-3' waves='light' icon='gavel' />
                                                    :
                                                    <Dropdown trigger={
                                                        <Button floating flat className='amber' waves='light' icon='add_shopping_cart' />
                                                    }>
                                                    <NavItem onClick={() => this.buySkin(i, 1, 1)}>네이비 페인트 (+5%)</NavItem>
                                                    <NavItem onClick={() => this.buySkin(i, 2, 1)}>그린블루 페인트 (+5%)</NavItem>
                                                    <NavItem onClick={() => this.buySkin(i, 3, 2)}>얼룩무늬 페인트 (+10%)</NavItem>
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
                            <Input s={6} label="Nickname" defaultValue="Administrator" onChange={(e, v)=>this.setState({ nicknameForm: v })}/>
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
                    <h5>GAME CONFIG</h5>
                    <div className='admin-navbar-button' onClick={this.loadGameData}><Icon>refresh</Icon></div>
                    <h6 className='admin-navbar-button'>{isGamePending && 'Loading...'}</h6>
                </div>
                {isGameLoaded?
                <div>
                    <div className="admin-gamedata-segment">
                        <p className="admin-gamedata-segment-title">~ 석상 ~</p>
                        <Row>
                            <Input s={2} label="HP" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, hp: v}})} />
                            <Input s={2} label="ATK" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, atk: v}})} />
                            <Input s={2} label="DEF" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, def: v}})} />
                            <Input s={2} label="CRT" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, crt: v}})} />
                            <Input s={2} label="AVD" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, avd: v}})} />
                            <Input s={2} label="Stage" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, aquisitionStage: v}})} />
                        </Row>
                        <Row>
                            <Input s={2} placeholder="몇" onChange={(e, v)=>this.setState({ statueInfoForm: {...statueInfoForm, whatNo: v}})} />
                            번 석상을
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={this.editStatueInfo} />
                            또는 신규 석상을
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={this.increaseMaxStatue} />
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
                            <Input s={2} label="HP" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, hp: v}})} />
                            <Input s={2} label="ATK" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, atk: v}})} />
                            <Input s={2} label="DEF" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, def: v}})} />
                            <Input s={2} label="CRT" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, crt: v}})} />
                            <Input s={2} label="AVD" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, avd: v}})} />
                            <Input s={2} label="exp" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, exp: v}})} />
                        </Row>
                        <Row>
                            <Input s={2} placeholder="몇" onChange={(e, v)=>this.setState({ mobInfoForm: {...mobInfoForm, whatNo: v}})} />
                            번 몬스터를
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={this.editMobInfo} />
                            또는 신규 몬스터를
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={this.increaseMaxMob} />
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
                        <Row>
                            <Input s={2} onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, mob1: v}})} />
                            <Input s={2} onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, mob2: v}})} />
                            <Input s={2} onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, mob3: v}})} />
                            <Input s={2} onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, mob4: v}})} />
                            <Input s={2} onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, mob5: v}})} />
                        </Row>
                        <Row>
                            <Input s={3} placeholder="STAGE" onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, stageNo: v}})} />
                            <Input s={3} placeholder="ROUND" onChange={(e, v)=>this.setState({ roundInfoForm: {...roundInfoForm, roundNo: v}})} />
                            <Button floating flat className='amber' waves='light' icon='edit' onClick={this.editStageRoundInfo} />&nbsp;
                            <Button floating flat className='light-green' waves='light' icon='add' onClick={this.increaseMaxStage} />
                        </Row>
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
        finney: state.userModule.finney,
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