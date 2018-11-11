import React, { Component, Fragment } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import Statue from 'Client/Components/Statue';
import FlatButton from 'Client/Components/FlatButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/userModule';
import * as gameActions from 'store/modules/gameModule';
import * as appActions from 'store/modules/appModule';
import * as TGVApi from 'utils/TGVApi';

class EquipDisplayContainer extends Component {

    state = {
        blacksmithMessage: '',
    }

    toFinney = (bigNumber) => bigNumber.c[0]/10;

    buyEquip = async (statueNo, part, look) => {
        try {
            this.setState({ blacksmithMessage: '조금만 기다려보게나! 뚝딱 만들어 주겠네.' });
            this.props.GameActions.setBlacksmithWorking(true);
            let fee = await this.props.TGV.basicFee.call();
            fee = this.toFinney(fee);
            await this.props.TGV.buyEquip(statueNo, part, look, 0, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            this.setState({ blacksmithMessage: '다됐네! 이제 착용을 해보면 되겠군. 조금만 기다려보게.' });
            while(true) {
                const newUserData = await TGVApi.getUserData(this.props.TGV, this.props.web3.eth.coinbase);
                if(JSON.stringify(newUserData.statues[statueNo].equip) !== JSON.stringify(this.props.userData.statues[statueNo].equip)) {
                    this.props.UserActions.syncFetchUserData(newUserData);
                    break;
                }
            }
        } catch(err) {
            console.error(err);
        } finally {
            this.props.GameActions.setBlacksmithWorking(false);
        }
    }

    upgradeEquip = async (statueNo, part, currentLevel) => {
        let fee = await this.props.TGV.getUpgradeCost(statueNo, part, currentLevel);
        const soul = fee[0].c[0];
        fee = this.toFinney(fee[1]);
        if(soul > this.props.userData.soul) {
            window.Materialize.toast("영혼의 결정이 " + soul + "개 필요합니다.", 1500);
            return;
        }
        try {
            this.setState({ blacksmithMessage: '조금만 기다려보게나! 뚝딱 만들어 주겠네.' });
            this.props.GameActions.setBlacksmithWorking(true);
            await this.props.TGV.upgradeEquip(statueNo, part, currentLevel, {
                from: this.props.web3.eth.coinbase,
                value: this.props.web3.toWei(fee, 'finney')
            });
            this.setState({ blacksmithMessage: '다됐네! 이제 착용을 해보면 되겠군. 조금만 기다려보게.' });
            while(true) {
                const newUserData = await TGVApi.getUserData(this.props.TGV, this.props.web3.eth.coinbase);
                if(JSON.stringify(newUserData.statues[statueNo].equip) !== JSON.stringify(this.props.userData.statues[statueNo].equip)) {
                    this.props.UserActions.syncFetchUserData(newUserData);
                    break;
                }
            }
        } catch(err) {
            console.error(err);
        } finally {
            this.props.GameActions.setBlacksmithWorking(false);
        }
    }

    render() {
        const { width, height } = this.props;
        const { hp, atk, def } = this.props.userData.statues[this.props.currentSelectedStatue].equip;
        return (
            <Container {...this.props}>
                <Box
                    width={width}
                    height={height}
                    color={0x0}
                    alpha={0.7} />
                {hp.level > 0
                ? <FlatButton
                    x={width*2/3}
                    y={height/7}
                    width={width/10*3}
                    height={height/4}
                    text={`+${hp.level} 모자\n현재: HP +${hp.value}\n강화: HP +${hp.nextValue}`}
                    onClick={() => this.upgradeEquip(this.props.currentSelectedStatue, 1, hp.level)} />
                : <Fragment>
                    <FlatButton
                        x={width*2/3}
                        y={height/7}
                        width={width/10*3}
                        height={height/12}
                        text={'페도라'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 1, 1)} />
                    <FlatButton
                        x={width*2/3}
                        y={height/7 + height/12}
                        width={width/10*3}
                        height={height/12}
                        text={'리본장식 모자'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 1, 2)} />
                    <FlatButton
                        x={width*2/3}
                        y={height/7 + height/6}
                        width={width/10*3}
                        height={height/12}
                        text={'스냅백'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 1, 3)} />
                </Fragment>
                }
                {atk.level > 0
                ? <FlatButton
                    x={width*2/3}
                    y={height/7*4}
                    width={width/10*3}
                    height={height/4}
                    text={`+${atk.level} 펜던트\n현재: 공격력 +${atk.value}\n강화: 공격력 +${atk.nextValue}`}
                    onClick={() => this.upgradeEquip(this.props.currentSelectedStatue, 2, atk.level)} />
                : <Fragment>
                    <FlatButton
                        x={width*2/3}
                        y={height/7*4}
                        width={width/10*3}
                        height={height/12}
                        text={'에메랄드 펜던트'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 2, 1)} />
                    <FlatButton
                        x={width*2/3}
                        y={height/7*4 + height/12}
                        width={width/10*3}
                        height={height/12}
                        text={'루비 펜던트'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 2, 2)} />
                    <FlatButton
                        x={width*2/3}
                        y={height/7*4 + height/6}
                        width={width/10*3}
                        height={height/12}
                        text={'사파이어 펜던트'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 2, 3)} />
                </Fragment>
                }
                {def.level > 0
                ? <FlatButton
                    x={width/10}
                    y={height/4}
                    width={width/10*3}
                    height={height/4}
                    text={`+${def.level} 이어링\n현재: 방어력 +${def.value}\n강화: 방어력 +${def.nextValue}`}
                    onClick={() => this.upgradeEquip(this.props.currentSelectedStatue, 3, def.level)} />
                : <Fragment>
                    <FlatButton
                        x={width/10}
                        y={height/4}
                        width={width/10*3}
                        height={height/12}
                        text={'체인 이어링'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 3, 1)} />
                    <FlatButton
                        x={width/10}
                        y={height/4 + height/12}
                        width={width/10*3}
                        height={height/12}
                        text={'하트 장식 이어링'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 3, 2)} />
                    <FlatButton
                        x={width/10}
                        y={height/4 + height/6}
                        width={width/10*3}
                        height={height/12}
                        text={'블루문'}
                        onClick={() => this.buyEquip(this.props.currentSelectedStatue, 3, 3)} />
                </Fragment>
                }
                <Statue
                    x={width/2}
                    y={height*3/4}
                    no={this.props.currentSelectedStatue}
                    scale={1.4}
                    eye={this.props.userData.defaultStatueLook.eye}
                    hair={this.props.userData.defaultStatueLook.hair}
                    hpEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.hp.look}
                    atkEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.atk.look}
                    defEquipLook={this.props.userData.statues[this.props.currentSelectedStatue].equip.def.look} />
                {this.props.isBlacksmithWorking && <Container
                    width={width}
                    height={height}
                    interactive>
                    <Box width={width} height={height} alpha={0.5} />
                    <Text text={this.state.blacksmithMessage} anchor={[0.5, 0.5]} x={width/2} y={height/2} style={{ fill: 0xffffff, fontSize: 16 }}/>
                </Container>}
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
        isBlacksmithWorking: state.gameModule.isBlacksmithWorking,
    }),
    dispatch => ({
        UserActions: bindActionCreators(userActions, dispatch),
        GameActions: bindActionCreators(gameActions, dispatch),
        AppActions: bindActionCreators(appActions, dispatch),
    }),
)(EquipDisplayContainer);