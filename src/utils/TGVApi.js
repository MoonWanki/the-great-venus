const getUser = async (TGV, address) => {
    const res = await TGV.users.call(address);
    return {
        name: res[0],
        exp: Number(res[1].c[0]),
        gem: Number(res[2].c[0]),
        rank: Number(res[3].c[0]),
        level: Number(res[4].c[0]),
        lastStage: Number(res[5].c[0]),
        numStatues: Number(res[6].c[0]),
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

const getExtraValueByEquipLevel = async (TGV, part, equipLevel) => {
    const res = await TGV.getExtraValueByEquipLevel.call(part, equipLevel);
    return Number(res.c[0]);
}

const getStatueSpec = async (TGV, level, statueNo, equip) => {

    const statueSpec = await getStatueRawSpec(TGV, statueNo, level);
    const extraCrtPerEquipLevel = await TGV.extraCrtPerEquipLevel.call();
    const extraAvdPerEquipLevel = await TGV.extraAvdPerEquipLevel.call();

    const extraHpByEquip = await getExtraValueByEquipLevel(TGV, 1, equip.hpEquipLevel);
    const extraAtkByEquip = await getExtraValueByEquipLevel(TGV, 2, equip.atkEquipLevel);
    const extraDefByEquip = await getExtraValueByEquipLevel(TGV, 3, equip.defEquipLevel);
    const extraCrtByEquip = extraCrtPerEquipLevel * equip.crtEquipLevel;
    const extraAvdByEquip = extraAvdPerEquipLevel * equip.avdEquipLevel;

    return {
        hp: statueSpec.hp + extraHpByEquip,
        hpDefault: statueSpec.hp,
        hpExtra: extraHpByEquip,
        atk: statueSpec.atk + extraAtkByEquip,
        atkDefault: statueSpec.atk,
        atkExtra: extraAtkByEquip,
        def: statueSpec.def + extraDefByEquip,
        defDefault: statueSpec.def,
        defExtra: extraDefByEquip,
        crt: statueSpec.crt + extraCrtByEquip,
        crtDefault: statueSpec.crt,
        crtExtra: extraCrtByEquip,
        avd: statueSpec.avd + extraAvdByEquip,
        avdDefault: statueSpec.avd,
        avdExtra: extraAvdByEquip,
        equip: {
            hp: {
                look: equip.hpEquipLook,
                level: equip.hpEquipLevel,
                value: extraHpByEquip,
                nextValue: await getExtraValueByEquipLevel(TGV, 1, equip.hpEquipLevel + 1),
            },
            atk: {
                look: equip.atkEquipLook,
                level: equip.atkEquipLevel,
                value: extraAtkByEquip,
                nextValue: await getExtraValueByEquipLevel(TGV, 2, equip.atkEquipLevel + 1),
            },
            def: {
                look: equip.defEquipLook,
                level: equip.defEquipLevel,
                value: extraDefByEquip,
                nextValue: await getExtraValueByEquipLevel(TGV, 3, equip.defEquipLevel + 1),
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

const getMobInfoList = async (TGV, maxMob) => {
    let promises = [];
    for(let i=1 ; i<=maxMob ; i++) {
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

export const getGameData = async (TGV) => {
    const maxStatue = await TGV.maxStatue.call();
    const maxMob = await TGV.maxMob.call();
    const maxStage = await TGV.maxStage.call();
    const statueInfoList = await getStatueInfoList(TGV, maxStatue);
    const mobInfoList = await getMobInfoList(TGV, maxMob);
    const stageInfoList = await getStageInfoList(TGV, maxStage);
    return {
        maxStatue: maxStatue,
        maxMob: maxMob,
        maxStage: maxStage,
        statueInfoList: statueInfoList,
        mobInfoList: mobInfoList,
        stageInfoList: stageInfoList,
    }
}

const getRequiredExp = async (TGV, level) => {
    const res = await TGV.getRequiredExp.call(level);
    return res.c[0];
}

const getDefaultStatueLook = async (TGV, address) => {
    let res = await TGV.defaultStatueLook.call(address, 1);
    const hair = res.c[0];
    res = await TGV.defaultStatueLook.call(address, 2);
    const eyes = res.c[0];
    res = await TGV.defaultStatueLook.call(address, 3);
    const skin = res.c[0];
    return {
        hair: hair,
        eyes: eyes,
        skin: skin,
    }
}

export const getUserData = async (TGV, address) => {
    const user = await getUser(TGV, address);
    const statueEquipInfo = await getStatueEquipInfo(TGV, address, user.numStatues);
    let statueSpecList = [];
    for(let i=0 ; i<user.numStatues ; i++) 
        statueSpecList.push(await getStatueSpec(TGV, user.level, i, statueEquipInfo[i]));
    const requiredExp = await getRequiredExp(TGV, user.level);
    const preRequiredExp = user.level > 1 ? await getRequiredExp(TGV, user.level - 1) : 0;
    const percentage = (user.exp - preRequiredExp) / (requiredExp - preRequiredExp) * 100;
    return {
        ...user,
        statues: statueSpecList,
        requiredExp: requiredExp,
        expPercentage: percentage.toFixed(2),
        defaultStatueLook: await getDefaultStatueLook(TGV, address),
    }
}

export const clearStage = async (TGV, stageNo, statueNoList, coinbase) => {
    const res = await TGV.clearStage(stageNo, statueNoList, { from: coinbase });
    console.log(res);
    let roundList = [];
    let attackList = [];
    res.logs.forEach(({ event, args }) => {
        switch(event) {
            case 'AttackResult':
                attackList.push({
                    way: args.way,
                    unit: args.unit.c[0],
                    mob: args.mob.c[0],
                    damage: args.damage.c[0],
                    isCrt: args.isCrt,
                });
                break;
            case 'RoundResult':
                roundList.push({
                    victory: args.victory,
                    exp: args.exp.c[0],
                    gem: args.gem.c[0],
                    attackList: attackList,
                });
                attackList = [];
                break;
            default: break;
        }
    });
    return roundList;
};