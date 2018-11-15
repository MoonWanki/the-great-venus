import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import Statue from 'Client/Components/Statue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import * as appActions from 'store/modules/appModule';
import * as forgeActions from 'store/modules/forgeModule';
import * as TGVApi from 'utils/TGVApi';
import EquipDisplay from './EquipDisplay';

const lookNames = {
    hp: ['페도라', '리본장식모자', '스냅백'],
    atk: ['에메랄드 펜던트', '루비 펜던트', '사파이어 펜던트'],
    def: ['체인 이어링', '하트장식 이어링', '블루문 이어링'],
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class EquipDisplayContainer extends Component {

    toFinney = bigNumber => bigNumber.c[0]/10;

    buyEquip = async (part, look) => {
        const { currentSelectedStatue: statueNo } = this.props;
        try {
            const fee = this.toFinney(await this.props.TGV.basicFee.call());
            this.props.ForgeActions.startWorking({ statueNo: statueNo, part: part, message: '조금만 기다려보게나! 뚝딱 만들어 주겠네.' });
            await this.props.TGV.buyEquip(statueNo, part, look, 0, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            this.props.ForgeActions.setMessage({ statueNo: statueNo, part: part, message: '다됐네! 이제 착용을 해보면 되겠군. 잠시만 기다려보게.' });
            await this.checkEquipUpgraded(statueNo, part, 0);
        } catch(err) {
            console.error(err);
        } finally {
            this.props.ForgeActions.finishWorking({ statueNo: statueNo, part: part });
        }
    }

    upgradeEquip = async (part, currentLevel) => {
        const { currentSelectedStatue: statueNo, userData, finney, TGV } = this.props;
        let fee = await TGV.getUpgradeCost(statueNo, part, currentLevel);
        const sorbiote = fee[0].c[0];
        fee = this.toFinney(fee[1]);
        if(sorbiote > userData.sorbiote || fee > finney) {
            window.Materialize.toast("소비오트가 " + sorbiote + "개 필요합니다.", 1500);
            return;
        }
        try {
            this.props.UserActions.syncFetchUserData({ ...userData, sorbiote: userData.sorbiote - sorbiote });
            this.props.ForgeActions.startWorking({ statueNo: statueNo, part: part, message: '조금만 기다려보게나! 뚝딱 만들어 주겠네.' });
            await this.props.TGV.upgradeEquip(statueNo, part, currentLevel, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            this.props.ForgeActions.setMessage({ statueNo: statueNo, part: part, message: '다됐네! 이제 착용을 해보면 되겠군. 잠시만 기다려보게.' });
            await this.checkEquipUpgraded(statueNo, part, currentLevel);
        } catch(err) {
            console.error(err);
            this.props.UserActions.syncFetchUserData({ ...userData, sorbiote: userData.sorbiote });
        } finally {
            this.props.ForgeActions.finishWorking({ statueNo: statueNo, part: part });
        }
    }

    checkEquipUpgraded = async (statueNo, part, oldLevel) => {
        while(true) {
            await sleep(1000);
            const newUserData = await TGVApi.getUserData(this.props.TGV, this.props.web3.eth.coinbase);
            let newLevel;
            if(part===1) {
                newLevel = newUserData.statues[statueNo].equip.hp.level;
            } else if(part===2) {
                newLevel = newUserData.statues[statueNo].equip.atk.level;
            } else if(part===3) {
                newLevel = newUserData.statues[statueNo].equip.def.level;
            }
            if(oldLevel !== newLevel) {
                this.props.UserActions.syncFetchUserData(newUserData);
                break;
            }
        }
    }

    render() {
        const { width, height, currentSelectedStatue } = this.props;
        const { hp, atk, def } = this.props.userData.statues[this.props.currentSelectedStatue].equip;
        const EquipDisplaySize = { w: width*4/14, h: height/5 };
        return (
            <Container {...this.props}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.5} />
                <EquipDisplay
                    x={width/14}
                    y={height/7}
                    width={EquipDisplaySize.w}
                    height={EquipDisplaySize.h}
                    equip={hp}
                    isWorking={this.props.forgeStatus[currentSelectedStatue][0].isWorking}
                    message={this.props.forgeStatus[currentSelectedStatue][0].message}
                    partName='머리장식'
                    valueName='HP'
                    lookNames={lookNames.hp}
                    onBuyEquip={look => this.buyEquip(1, look)}
                    onUpgradeEquip={() => this.upgradeEquip(1, hp.level)} />
                <EquipDisplay
                    x={width*9/14}
                    y={height/7}
                    width={EquipDisplaySize.w}
                    height={EquipDisplaySize.h}
                    equip={atk}
                    isWorking={this.props.forgeStatus[currentSelectedStatue][1].isWorking}
                    message={this.props.forgeStatus[currentSelectedStatue][1].message}
                    partName='펜던트'
                    valueName='공격력'
                    lookNames={lookNames.atk}
                    onBuyEquip={look => this.buyEquip(2, look)}
                    onUpgradeEquip={() => this.upgradeEquip(2, atk.level)} />
                <EquipDisplay
                    x={width/14}
                    y={height/2}
                    width={EquipDisplaySize.w}
                    height={EquipDisplaySize.h}
                    equip={def}
                    isWorking={this.props.forgeStatus[currentSelectedStatue][2].isWorking}
                    message={this.props.forgeStatus[currentSelectedStatue][2].message}
                    partName='이어링'
                    valueName='방어력'
                    lookNames={lookNames.def}
                    onBuyEquip={look => this.buyEquip(3, look)}
                    onUpgradeEquip={() => this.upgradeEquip(3, def.level)} />
                <Statue
                    x={width/2}
                    y={height*3/4}
                    no={this.props.currentSelectedStatue}
                    scale={1.2}
                    eye={this.props.userData.defaultStatueLook.eye}
                    hair={this.props.userData.defaultStatueLook.hair}
                    hpEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.hp.look}
                    atkEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.atk.look}
                    defEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.def.look} />
            </Container>
        );
    }
}

export default connect(
    state => ({
        web3: state.web3Module.web3,
        TGV: state.web3Module.TGV,
        gameData: state.gameModule.gameData,
        userData: state.userModule.userData,
        forgeStatus: state.forgeModule.forgeStatus,
        finney: state.userModule.finney,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
        ForgeActions: bindActionCreators(forgeActions, dispatch),
    }),
)(EquipDisplayContainer);