export const getUser = async (TGV, address) => {
    const user = await TGV.users.call(address);
    return {
        name: user[0],
        rank: Number(user[1].c[0]),
        exp: Number(user[2].c[0]),
        sorbiote: Number(user[3].c[0]),
        level: Number(user[4].c[0]),
        lastStage: Number(user[5].c[0]),
        numStatues: Number(user[6].c[0]),
    }
}

const getStatueEquipInfo = async (TGV, address, numStatues) => {
    let promises = [];
    for(let i=0 ; i<numStatues ; i++) promises.push(TGV.statueEquipInfo.call(address, i));
    const equipInfoList = await Promise.all(promises);
    return equipInfoList.map(equipInfo => {
        return {
            hpEquipLook: Number(equipInfo[0].c[0]),
            atkEquipLook: Number(equipInfo[1].c[0]),
            defEquipLook: Number(equipInfo[2].c[0]),
            crtEquipLook: Number(equipInfo[3].c[0]),
            avdEquipLook: Number(equipInfo[4].c[0]),
            hpEquipLevel: Number(equipInfo[5].c[0]),
            atkEquipLevel: Number(equipInfo[6].c[0]),
            defEquipLevel: Number(equipInfo[7].c[0]),
            crtEquipLevel: Number(equipInfo[8].c[0]),
            avdEquipLevel: Number(equipInfo[9].c[0]),
        };
    });
};

export const getStatueRawSpec = async (TGV, StatueNo, level)  => {
    const res = await TGV.getStatueRawSpec.call(StatueNo, level);
    return {
        hp: Number(res[0].c[0]),
        atk: Number(res[1].c[0]),
        def: Number(res[2].c[0]),
        crt: Number(res[3].c[0]),
        avd: Number(res[4].c[0]),
    }
}

export const getMobRawSpec = async (TGV, mobNo)  => {
    const res = await TGV.getMobRawSpec.call(mobNo, 1);
    return {
        hp: Number(res[0].c[0]),
        atk: Number(res[1].c[0]),
        def: Number(res[2].c[0]),
        crt: Number(res[3].c[0]),
        avd: Number(res[4].c[0]),
    }
}

const getExtraValueByEquip = async (TGV, statueNo, part, equipLevel) => {
    const res = await TGV.getExtraValueByEquip.call(statueNo, part, equipLevel);
    return Number(res.c[0]);
}

const statueNameList = [
    '',
    '해태',
    '로빈슨',
    '줄리앙',
    '아그리파',
    '우는천사',
]

export const getStatueSpec = async (TGV, userName, level, statueNo, equip) => {
    const [ rawSpec, extraHpByEquip, extraAtkByEquip, extraDefByEquip, extraCrtByEquip, extraAvdByEquip, nextExtraHpByEquip, nextExtraAtkByEquip, nextExtraDefByEquip ] = await Promise.all([
        getStatueRawSpec(TGV, statueNo, level),
        getExtraValueByEquip(TGV, statueNo, 1, equip.hpEquipLevel),
        getExtraValueByEquip(TGV, statueNo, 2, equip.atkEquipLevel),
        getExtraValueByEquip(TGV, statueNo, 3, equip.defEquipLevel),
        getExtraValueByEquip(TGV, statueNo, 4, equip.crtEquipLevel),
        getExtraValueByEquip(TGV, statueNo, 5, equip.avdEquipLevel),
        getExtraValueByEquip(TGV, statueNo, 1, equip.hpEquipLevel + 1),
        getExtraValueByEquip(TGV, statueNo, 2, equip.atkEquipLevel + 1),
        getExtraValueByEquip(TGV, statueNo, 3, equip.defEquipLevel + 1),
    ]);
    return {
        name: statueNo===0 ? userName : statueNameList[statueNo],
        hp: rawSpec.hp + extraHpByEquip,
        hpDefault: rawSpec.hp,
        hpExtra: extraHpByEquip,
        atk: rawSpec.atk + extraAtkByEquip,
        atkDefault: rawSpec.atk,
        atkExtra: extraAtkByEquip,
        def: rawSpec.def + extraDefByEquip,
        defDefault: rawSpec.def,
        defExtra: extraDefByEquip,
        crt: rawSpec.crt + extraCrtByEquip,
        crtDefault: rawSpec.crt,
        crtExtra: extraCrtByEquip,
        avd: rawSpec.avd + extraAvdByEquip,
        avdDefault: rawSpec.avd,
        avdExtra: extraAvdByEquip,
        equip: {
            hp: {
                look: equip.hpEquipLook,
                level: equip.hpEquipLevel,
                value: extraHpByEquip,
                nextValue: nextExtraHpByEquip,
            },
            atk: {
                look: equip.atkEquipLook,
                level: equip.atkEquipLevel,
                value: extraAtkByEquip,
                nextValue: nextExtraAtkByEquip,
            },
            def: {
                look: equip.defEquipLook,
                level: equip.defEquipLevel,
                value: extraDefByEquip,
                nextValue: nextExtraDefByEquip,
            },
            crt: {
                look: equip.crtEquipLook,
                level: equip.crtEquipLevel,
                value: extraCrtByEquip,
            },
            avd: {
                look: equip.avdEquipLook,
                level: equip.avdEquipLevel,
                value: extraAvdByEquip,
            },
        }
    }
}

const getStatueInfoList = async (TGV, maxStatue) => {
    let promises = [];
    for(let i=0 ; i<=maxStatue ; i++) {
        promises.push(Promise.all([TGV.statueInfoList.call(i), TGV.statueAcquisitionStage.call(i)]));
    }
    const res = await Promise.all(promises);
    return res.map(([ statueInfo, aquisitionStage ]) => ({
        hp: statueInfo[0].c[0],
        atk: statueInfo[1].c[0],
        def: statueInfo[2].c[0],
        crt: statueInfo[3].c[0],
        avd: statueInfo[4].c[0],
        aquisitionStage: aquisitionStage.c[0],
    }));
}

const getMobInfoList = async (TGV, maxMob) => {
    let promises = [];
    for(let i=1 ; i<=maxMob ; i++) {
        promises.push(Promise.all([TGV.mobInfoList.call(i), TGV.expSpoiledByMob.call(i)]));
    }
    const res = await Promise.all(promises);
    return res.map(([ mobInfo, exp ]) => {
        return {
            hp: mobInfo[0].c[0],
            atk: mobInfo[1].c[0],
            def: mobInfo[2].c[0],
            crt: mobInfo[3].c[0],
            avd: mobInfo[4].c[0],
            exp: exp.c[0],
        }
    });
}

const getStageInfo = async (TGV, stageNo) => {
    const res = await TGV.getStageInfo.call(stageNo);
    return res.map(mobNoList => mobNoList.map(mobNo => mobNo.c[0]));
}

const getStageInfoList = async (TGV, maxStage) => {
    let stageInfoList = [];
    for(let i=1 ; i<=maxStage ; i++) {
        stageInfoList.push(await getStageInfo(TGV, i));
    }
    return stageInfoList;
}

const toFinney = (bigNumber) => bigNumber.c[0]/10;

export const getEquipConfig = async (TGV) => {
    let upgradeCostTable = [];
    let extraValueTable = [];
    let costByStatue, costByPart, extraValueByStatue, extraValueByPart;
    for(let i=0 ; i<4 ; i++) {
        costByStatue = [];
        extraValueByStatue = [];
        for(let j=1 ; j<=3 ; j++) {
            costByPart = [];
            extraValueByPart = [];
            for(let k=1 ; k<=45 ; k++) {
                costByPart.push(TGV.getUpgradeCost.call(i, j, k));
                extraValueByPart.push(TGV.getExtraValueByEquip.call(i, j, k));
            }
            costByPart = await Promise.all(costByPart);
            extraValueByPart = await Promise.all(extraValueByPart);
            costByStatue.push(costByPart.map(cost=>({
                sorbiote: cost[0].c[0],
                fee: toFinney(cost[1]),
            })));
            extraValueByStatue.push(extraValueByPart.map(value=>value.c[0]));
        }
        upgradeCostTable.push(costByStatue);
        extraValueTable.push(extraValueByStatue);
    }
    return {
        upgradeCostTable: upgradeCostTable,
        extraValueTable: extraValueTable,
    }
}

export const getItemShopInfo = async (TGV) => {
    const basicFee = await TGV.basicFee.call();
    const basicSorbiote = await TGV.basicSorbiote.call();
    const upgradeSorbioteDivFactor = await TGV.upgradeSorbioteDivFactor.call();
    const crtPrice = await TGV.crtPrice.call();
    const avdPrice = await TGV.avdPrice.call();
    return {
        basicFee: toFinney(basicFee),
        basicSorbiote: basicSorbiote.c[0],
        upgradeFeeDivFactor: upgradeSorbioteDivFactor.c[0],
        crtPrice: toFinney(crtPrice),
        avdPrice: toFinney(avdPrice),
    }
}

export const getGameData = async (TGV) => {
    const [ maxStatue, maxMob, maxStage ] = await Promise.all([
        TGV.maxStatue.call(),
        TGV.maxMob.call(),
        TGV.maxStage.call(),
    ]);
    const [ statueInfoList, mobInfoList, stageInfoList, itemShopInfo] = await Promise.all([
        getStatueInfoList(TGV, maxStatue),
        getMobInfoList(TGV, maxMob),
        getStageInfoList(TGV, maxStage),
        getItemShopInfo(TGV),
    ]);
    return {
        maxStatue: maxStatue.c[0],
        maxMob: maxMob.c[0],
        maxStage: maxStage.c[0],
        statueInfoList,
        mobInfoList,
        stageInfoList,
        itemShopInfo,
    }
}

const getRequiredExp = async (TGV, level) => {
    const res = await TGV.getRequiredExp.call(level);
    return res.c[0];
}

const getDefaultStatueLook = async (TGV, address) => {
    const { c: [ skin ] } = await TGV.defaultStatueLook.call(address, 0);
    const { c: [ hair ] } = await TGV.defaultStatueLook.call(address, 1);
    const { c: [ eye ] } = await TGV.defaultStatueLook.call(address, 2);
    return {
        skin,
        hair,
        eye,
    }
}

export const getUserData = async (TGV, address) => {
    const user = await getUser(TGV, address);
    const [ statueEquipInfo, defaultStatueLook ] = await Promise.all([getStatueEquipInfo(TGV, address, user.numStatues), getDefaultStatueLook(TGV, address)]);
    let statueSpecList = [];
    for(let i=0 ; i<user.numStatues ; i++) statueSpecList.push(await getStatueSpec(TGV, user.name, user.level, i, statueEquipInfo[i]));
    const [ requiredExp, nextRequiredExp ] = await Promise.all([getRequiredExp(TGV, user.level), getRequiredExp(TGV, user.level + 1)]);
    const preRequiredExp = user.level > 1 ? await getRequiredExp(TGV, user.level - 1) : 0;
    return {
        ...user,
        statues: statueSpecList,
        requiredExp,
        preRequiredExp,
        nextRequiredExp,
        defaultStatueLook,
    }
}

export const clearStage = async (TGV, stageNo, statueNoList, coinbase) => {
    const res = await TGV.clearStage(stageNo, statueNoList, { from: coinbase });
    console.log(res);
    let roundResultList = [];
    let ourUnits = [];
    let enemyUnits = [];
    let attackResultList = [];
    res.logs.forEach(({ event, args }) => {
        switch(event) {
            case 'RoundUnitInfo':
                if(args.isAlly) {
                    ourUnits.push({
                        no: args.no.c[0],
                        hp: args.hp.c[0],
                        atk: args.atk.c[0],
                        def: args.def.c[0],
                        crt: args.crt.c[0],
                        avd: args.avd.c[0],
                    });
                } else {
                    enemyUnits.push({
                        no: args.no.c[0],
                        hp: args.hp.c[0],
                        atk: args.atk.c[0],
                        def: args.def.c[0],
                        crt: args.crt.c[0],
                        avd: args.avd.c[0],
                    });
                }
                break;
            case 'AttackResult':
                attackResultList.push({
                    way: args.way,
                    from: args.from.c[0],
                    to: args.to.c[0],
                    damage: args.damage.c[0],
                    isCrt: args.isCrt,
                });
                break;
            case 'RoundResult':
                roundResultList.push({
                    ourUnits: ourUnits,
                    enemyUnits: enemyUnits,
                    attackResultList: attackResultList,
                    victory: args.victory,
                    exp: args.exp.c[0],
                    sorbiote: args.sorbiote.c[0],
                });
                ourUnits = [];
                enemyUnits = [];
                attackResultList = [];
                break;
            default: break;
        }
    });
    return roundResultList;
};

export const matchWithPlayer = async (TGV, oppanentAddr, coinbase) => {
    const res = await TGV.matchWithPlayer(oppanentAddr, { from: coinbase });
    console.log(res);
    let ourUnits = [];
    let enemyUnits = [];
    let attackResultList = [];
    let PvPResult;
    res.logs.forEach(({ event, args }) => {
        switch(event) {
            case 'RoundUnitInfo':
                if(args.isAlly) {
                    ourUnits.push({
                        no: args.no.c[0],
                        hp: args.hp.c[0],
                        atk: args.atk.c[0],
                        def: args.def.c[0],
                        crt: args.crt.c[0],
                        avd: args.avd.c[0],
                    });
                } else {
                    enemyUnits.push({
                        no: args.no.c[0],
                        hp: args.hp.c[0],
                        atk: args.atk.c[0],
                        def: args.def.c[0],
                        crt: args.crt.c[0],
                        avd: args.avd.c[0],
                    });
                }
                break;
            case 'AttackResult':
                attackResultList.push({
                    way: args.way,
                    from: args.from.c[0],
                    to: args.to.c[0],
                    damage: args.damage.c[0],
                    isCrt: args.isCrt,
                });
                break;
            case 'PvPResult':
                PvPResult = {
                    ourUnits: ourUnits,
                    enemyUnits: enemyUnits,
                    attackResultList: attackResultList,
                    victory: args.victory,
                    userName: args.userName,
                    opponentName: args.opponentName,
                    finalUserRank: args.finalUserRank.c[0],
                    finalOpponentRank: args.finalOpponentRank.c[0],
                };
                break;
            default: break;
        }
    });
    return PvPResult;
};

const getQuota = async TGV => {
    const res = await TGV.getQuota.call();
    return {
        diamond: toFinney(res[0]),
        platinum: toFinney(res[1]),
        gold: toFinney(res[2]),
    }
}

export const getColosseumInfo = async TGV => {
    const cutForDiamond = await TGV.cutForDiamond.call();
    const cutForPlatinum = await TGV.cutForPlatinum.call();
    const cutForGold = await TGV.cutForGold.call();
    const cutForSilver = await TGV.cutForSilver.call();
    const nextRefundTime = await TGV.nextRefundTime.call();
    const refundPeriod = await TGV.refundPeriod.call();
    return {
        quota: await getQuota(TGV),
        nextRefundTime: new Date(nextRefundTime.c[0]),
        cutForDiamond: cutForDiamond.c[0],
        cutForPlatinum: cutForPlatinum.c[0],
        cutForGold: cutForGold.c[0],
        cutForSilver: cutForSilver.c[0],
        refundPeriod: refundPeriod.c[0],
    }
}