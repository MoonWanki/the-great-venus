const getUser = async (TGV, address) => {
    const res = await TGV.users.call(address);
    return {
        name: res[0],
        rank: Number(res[1].c[0]),
        gold: Number(res[2].c[0]),
        exp: Number(res[3].c[0]),
        level: Number(res[4].c[0]),
        lastStage: Number(res[5].c[0]),
        numStatue: Number(res[6].c[0]),
    }
}

const getEquipList = async (TGV, address, numstatue) => {
    let promises = [];
    for(let i=0 ; i<numstatue ; i++) promises.push(TGV.equipList.call(address, i));
    const equipList = await Promise.all(promises);
    return equipList.map(unit => {
        return {
            hpEquipType: Number(unit[0].c[0]),
            hpEquipLevel: Number(unit[1].c[0]),
            atkEquipType: Number(unit[2].c[0]),
            atkEquipLevel: Number(unit[3].c[0]),
            defEquipType: Number(unit[4].c[0]),
            defEquipLevel: Number(unit[5].c[0]),
            crtEquipType: Number(unit[6].c[0]),
            crtEquipLevel: Number(unit[7].c[0]),
            avdEquipType: Number(unit[8].c[0]),
            avdEquipLevel: Number(unit[9].c[0]),
        };
    });
};

export const getStatueDefaultValue = async (TGV, StatueNo)  => {
    const res = await TGV.statueInfoList.call(StatueNo);
    return {
        hp: res[0].c[0],
        atk: res[1].c[0],
        def: res[2].c[0],
        crt: res[3].c[0],
        avd: res[4].c[0],
    }
}

const calcStatueData = async (TGV, level, statueNo, equip) => {

    const defaultValue = await getStatueDefaultValue(TGV, statueNo);

    const extraHpByLevel = await TGV.getExtraUnitValue(1, level);
    const extraAtkByLevel = await TGV.getExtraUnitValue(2, level);
    const extraDefByLevel = await TGV.getExtraUnitValue(3, level);

    const extraHpByEquip = await TGV.getExtraEquipValue(1, equip.hpEquipLevel);
    const extraAtkByEquip = await TGV.getExtraEquipValue(2, equip.atkEquipLevel);
    const extraDefByEquip = await TGV.getExtraEquipValue(3, equip.defEquipLevel);
    const extraCrtByEquip = await TGV.getExtraEquipValue(4, equip.crtEquipLevel);
    const extraAvdByEquip = await TGV.getExtraEquipValue(5, equip.avdEquipLevel);

    return {
        hp: Number(defaultValue.hp) + Number(extraHpByLevel) + Number(extraHpByEquip.c[0]),
        hpDefault: Number(defaultValue.hp) + Number(extraHpByLevel),
        hpExtra: Number(extraHpByEquip.c[0]),
        atk: Number(defaultValue.atk) + Number(extraAtkByLevel) + Number(extraAtkByEquip.c[0]),
        atkDefault: Number(defaultValue.atk) + Number(extraAtkByLevel),
        atkExtra: Number(extraAtkByEquip.c[0]),
        def: Number(defaultValue.def) + Number(extraDefByLevel) + Number(extraDefByEquip.c[0]),
        defDefault: Number(defaultValue.def) + Number(extraDefByLevel),
        defExtra: Number(extraDefByEquip.c[0]),
        crt: Number(defaultValue.crt) + Number(extraCrtByEquip.c[0]),
        crtDefault: Number(defaultValue.crt),
        crtExtra: Number(extraCrtByEquip.c[0]),
        avd: Number(defaultValue.avd) + Number(extraAvdByEquip.c[0]),
        avdDefault: Number(defaultValue.avd),
        avdExtra: Number(extraAvdByEquip.c[0]),
        equip: {
            hp: {
                style: equip.hpEquipType,
                level: equip.hpEquipLevel,
                value: extraHpByEquip.c[0],
                nextValue: await TGV.getExtraEquipValue(1, equip.hpEquipLevel + 1),
            },
            atk: {
                style: equip.atkEquipType,
                level: equip.atkEquipLevel,
                value: extraAtkByEquip.c[0],
                nextValue: await TGV.getExtraEquipValue(2, equip.atkEquipLevel + 1),
            },
            def: {
                style: equip.defEquipType,
                level: equip.defEquipLevel,
                value: extraDefByEquip.c[0],
                nextValue: await TGV.getExtraEquipValue(3, equip.defEquipLevel + 1),
            },
            crt: {
                style: equip.crtEquipType,
                level: equip.crtEquipLevel,
                value: extraCrtByEquip.c[0],
                nextValue: await TGV.getExtraEquipValue(4, equip.crtEquipLevel + 1),
            },
            avd: {
                style: equip.avdEquipType,
                level: equip.avdEquipLevel,
                value: extraAvdByEquip.c[0],
                nextValue: await TGV.getExtraEquipValue(5, equip.avdEquipLevel + 1),
            },
        }
    }
}

const getStatueInfoList = async (TGV, numStatueInfo) => {
    let promises = [];
    for(let i=0 ; i<=numStatueInfo ; i++) {
        promises.push(TGV.statueInfoList.call(i));
    }
    const res = await Promise.all(promises);
    return res.map(statueInfo => {
        return {
            hp: statueInfo[0].c[0],
            atk: statueInfo[1].c[0],
            def: statueInfo[2].c[0],
            crt: statueInfo[3].c[0],
            avd: statueInfo[4].c[0],
        }
    });
}

const getMobInfoList = async (TGV, numMobInfo) => {
    let promises = [];
    for(let i=1 ; i<=numMobInfo ; i++) {
        promises.push(TGV.mobInfoList.call(i));
    }
    const res = await Promise.all(promises);
    return res.map(mobInfo => {
        return {
            hp: mobInfo[0].c[0],
            atk: mobInfo[1].c[0],
            def: mobInfo[2].c[0],
            crt: mobInfo[3].c[0],
            avd: mobInfo[4].c[0],
        }
    });
}

const getStageInfoList = async (TGV, numStageInfo) => {
    let promises = [];
    for(let i=1 ; i<=numStageInfo ; i++) {
        for(let j=0 ; j<15 ; j++) {
            promises.push(TGV.stageInfoList.call(i, j));
        }
    }
    const res = await Promise.all(promises);
    let stageInfoList = [];
    for(let i=0 ; i<numStageInfo ; i++) {
        let stage = [];
        for(let j=0 ; j<3 ; j++) {
            let round = [];
            for(let k=0 ; k<5 ; k++) {
                round.push(res[i*15 + j*5 + k].c[0]);
            }
            stage.push(round);
        }
        stageInfoList.push(stage);
    }
    return stageInfoList;
}

export const getGameData = async (TGV) => {
    const numStatueInfo = await TGV.numStatueInfo.call();
    const numMobInfo = await TGV.numMobInfo.call();
    const numStageInfo = await TGV.numStageInfo.call();
    const statueInfoList = await getStatueInfoList(TGV, numStatueInfo);
    const mobInfoList = await getMobInfoList(TGV, numMobInfo);
    const stageInfoList = await getStageInfoList(TGV, numStageInfo);
    return {
        numStatueInfo: numStatueInfo,
        numMobInfo: numMobInfo,
        numStageInfo: numStageInfo,
        statueInfoList: statueInfoList,
        mobInfoList: mobInfoList,
        stageInfoList: stageInfoList,
    }
}

const getRequiredExp = async (TGV, level) => {
    const res = await TGV.getRequiredExp.call(level);
    return res.c[0];
}

export const getUserData = async (TGV, address) => {
    const user = await getUser(TGV, address);
    const equipList = await getEquipList(TGV, address, user.numStatue);
    let promises = [];
    for(let i=0 ; i<user.numStatue ; i++) promises.push(calcStatueData(TGV, user.level, i, equipList[i]));
    const statueList = await Promise.all(promises);
    const requiredExp = await getRequiredExp(TGV, user.level);
    const preRequiredExp = user.level > 1 ? await getRequiredExp(TGV, user.level - 1) : 0;
    const percentage = (user.exp - preRequiredExp) / (requiredExp - preRequiredExp) * 100;
    return {
        ...user,
        statues: statueList,
        requiredExp: requiredExp,
        expPercentage: percentage.toFixed(2),
    }
}

export const clearStage = async (TGV, stageNo, units, coinbase) => {
    const res = await TGV.clearStage(stageNo, units, { from: coinbase });
    console.log(res);
    let roundList = [];
    let attackList = [];
    res.logs.forEach(({ event, args }) => {
        switch(event) {
            case 'AttackEvent':
                attackList.push({
                    way: args.way,
                    unit: args.unit.c[0],
                    mob: args.mob.c[0],
                    damage: args.damage.c[0],
                    isCrt: args.isCrt,
                });
                break;
            case 'RoundEvent':
                roundList.push({
                    victory: args.victory,
                    gold: args.Gold.c[0],
                    exp: args.Exp.c[0],
                    attackList: attackList,
                });
                attackList = [];
                break;
            default: break;
        }
    });
    return roundList;
};