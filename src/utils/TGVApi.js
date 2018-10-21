const getUser = async (TGVInstance, address) => {
    const res = await TGVInstance.users.call(address);
    return {
        name: res[0],
        rank: res[1].c[0],
        gold: res[2].c[0],
        exp: res[3].c[0],
        level: res[4].c[0],
        lastStage: res[5].c[0],
        numStatue: res[6].c[0],
    }
}

const getEquipList = async (TGVInstance, address, numstatue) => {
    let promises = [];
    for(let i=0 ; i<numstatue ; i++) promises.push(TGVInstance.equipList.call(address, i));
    const equipList = await Promise.all(promises);
    return equipList.map(unit => {
        return {
            hpEquipType: unit[0].c[0],
            hpEquipLevel: unit[1].c[0],
            atkEquipType: unit[2].c[0],
            atkEquipLevel: unit[3].c[0],
            defEquipType: unit[4].c[0],
            defEquipLevel: unit[5].c[0],
            crtEquipType: unit[6].c[0],
            crtEquipLevel: unit[7].c[0],
            avdEquipType: unit[8].c[0],
            avdEquipLevel: unit[9].c[0],
        };
    });
};

export const getStatueDefaultValue = async (TGVInstance, StatueNo)  => {
    const res = await TGVInstance.statueInfoList.call(StatueNo);
    return {
        hp: res[0].c[0],
        atk: res[1].c[0],
        def: res[2].c[0],
        crt: res[3].c[0],
        avd: res[4].c[0],
    }
}

const calcStatueData = async (TGVInstance, level, statueNo, equip) => {

    const defaultValue = await getStatueDefaultValue(TGVInstance, statueNo);

    const extraHpByLevel = await TGVInstance.getExtraUnitValue(1, level);
    const extraAtkByLevel = await TGVInstance.getExtraUnitValue(2, level);
    const extraDefByLevel = await TGVInstance.getExtraUnitValue(3, level);

    const extraHpByEquip = await TGVInstance.getExtraUnitValue(1, equip.hpEquipLevel);
    const extraAtkByEquip = await TGVInstance.getExtraUnitValue(2, equip.atkEquipLevel);
    const extraDefByEquip = await TGVInstance.getExtraUnitValue(3, equip.defEquipLevel);
    const extraCrtByEquip = await TGVInstance.getExtraUnitValue(4, equip.crtEquipLevel);
    const extraAvdByEquip = await TGVInstance.getExtraUnitValue(5, equip.avdEquipLevel);

    return {
        hp: {
            default: Number(defaultValue.hp) + Number(extraHpByLevel),
            extra: extraHpByEquip.c[0],
            equipType: equip.hpEquipType,
            equipLevel: equip.hpEquipLevel,
        },
        atk: {
            default: Number(defaultValue.atk) + Number(extraAtkByLevel),
            extra: extraAtkByEquip.c[0],
            equipType: equip.atkEquipType,
            equipLevel: equip.atkEquipLevel,
        },
        def: {
            default: Number(defaultValue.def) + Number(extraDefByLevel),
            extra: extraDefByEquip.c[0],
            equipType: equip.defEquipType,
            equipLevel: equip.defEquipLevel,
        },
        crt: {
            default: defaultValue.crt,
            extra: extraCrtByEquip.c[0],
            equipType: equip.crtEquipType,
            equipLevel: equip.crtEquipLevel,
        },
        avd: {
            default: defaultValue.avd,
            extra: extraAvdByEquip.c[0],
            equipType: equip.avdEquipType,
            equipLevel: equip.avdEquipLevel,
        },
    }
}

const getStatueInfoList = async (TGVInstance, numStatueInfo) => {
    let promises = [];
    for(let i=0 ; i<=numStatueInfo ; i++) {
        promises.push(TGVInstance.statueInfoList.call(i));
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

const getMobInfoList = async (TGVInstance, numMobInfo) => {
    let promises = [];
    for(let i=1 ; i<=numMobInfo ; i++) {
        promises.push(TGVInstance.mobInfoList.call(i));
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

const getStageInfoList = async (TGVInstance, numStageInfo) => {
    let promises = [];
    for(let i=1 ; i<=numStageInfo ; i++) {
        for(let j=0 ; j<15 ; j++) {
            promises.push(TGVInstance.stageInfoList.call(i, j));
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

export const getGameData = async (TGVInstance) => {
    const numStatueInfo = await TGVInstance.numStatueInfo.call();
    const numMobInfo = await TGVInstance.numMobInfo.call();
    const numStageInfo = await TGVInstance.numStageInfo.call();
    const statueInfoList = await getStatueInfoList(TGVInstance, numStatueInfo);
    const mobInfoList = await getMobInfoList(TGVInstance, numMobInfo);
    const stageInfoList = await getStageInfoList(TGVInstance, numStageInfo);
    return {
        numStatueInfo: numStatueInfo,
        numMobInfo: numMobInfo,
        numStageInfo: numStageInfo,
        statueInfoList: statueInfoList,
        mobInfoList: mobInfoList,
        stageInfoList: stageInfoList,
    }
}

const getRequiredExp = async (TGVInstance, level) => {
    const res = await TGVInstance.getRequiredExp.call(level);
    return res.c[0];
}

export const getUserData = async (TGVInstance, address) => {
    const user = await getUser(TGVInstance, address);
    const equipList = await getEquipList(TGVInstance, address, user.numStatue);
    let promises = [];
    for(let i=0 ; i<user.numStatue ; i++) promises.push(calcStatueData(TGVInstance, user.level, i, equipList[i]));
    const statueList = await Promise.all(promises);
    const requiredExp = await getRequiredExp(TGVInstance, user.level);
    const preRequiredExp = await getRequiredExp(TGVInstance, user.level - 1);
    const percentage = (user.exp - preRequiredExp) / (requiredExp - preRequiredExp) * 100;
    return {
        ...user,
        statue: statueList,
        requiredExp: requiredExp,
        expPercentage: percentage.toFixed(2),
    }
}

export const clearStage = async (TGVInstance, stageNo, units, coinbase) => {
    const res = await TGVInstance.clearStage(stageNo, units, { from: coinbase });
    console.log(res);
    let roundList = [];
    let attackList = [];
    res.logs.forEach(({ event, args }) => {
        if(event === 'AttackEvent') {
            attackList.push({
                way: args.way,
                unit: args.unit.c[0],
                mob: args.mob.c[0],
                damage: args.damage.c[0],
                isCrt: args.isCrt,
            })
        }
        else if(event === 'RoundEvent') {
            roundList.push({
                victory: args.victory,
                gold: args.Gold.c[0],
                exp: args.Exp.c[0],
                attackList: attackList,
            });
            attackList = [];
        }
    });
    return roundList;

};