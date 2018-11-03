pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    constructor() public {
        
        extraCrtPerEquipLevel = 10;
        extraAvdPerEquipLevel = 5;

        levelIncreaseDivFactor = 17;
        equipIncreaseDivFactor = 23;
        equipBigIncreaseDivFactor = 6;
        equipIncreasePowerDivFactor = 7;

        damageFlexibler = 7;
        damageMulFactor = 200;
        damageDivFactor = 100;

        matchableRankGap = 10;

        statueInfoList[0] = Unit(300, 120, 90, 10, 5, 200, 4, false);
        statueInfoList[1] = Unit(280, 85, 76, 10, 5, 200, 4, false);
        statueInfoList[2] = Unit(320, 135, 110, 10, 5, 200, 4, false);
        statueInfoList[3] = Unit(350, 180, 150, 10, 5, 200, 4, false);
        statueInfoList[4] = Unit(360, 200, 120, 10, 5, 200, 4, false);
        statueInfoList[5] = Unit(380, 220, 80, 10, 5, 200, 4, false);
        statueInfoList[6] = Unit(400, 250, 100, 10, 5, 200, 4, false);
        statueInfoList[7] = Unit(420, 280, 120, 10, 5, 200, 4, false);
        statueInfoList[8] = Unit(450, 300, 160, 10, 5, 200, 4, false);
        statueInfoList[9] = Unit(400, 300, 180, 10, 5, 200, 4, false);
        statueInfoList[10] = Unit(500, 320, 200, 10, 5, 200, 4, false);
        statueInfoList[11] = Unit(500, 350, 200, 10, 5, 200, 4, false);
        statueInfoList[12] = Unit(550, 400, 220, 10, 5, 200, 4, false);
        statueInfoList[13] = Unit(720, 400, 220, 10, 5, 200, 4, false);
        statueInfoList[14] = Unit(800, 480, 250, 10, 5, 200, 4, false);
        statueInfoList[15] = Unit(1000, 600, 250, 10, 5, 200, 4, false);
        maxStatue = 15;

        mobInfoList[1] = Unit(100, 25, 80, 10, 5, 200, 4, false);
        mobInfoList[2] = Unit(120, 35, 100, 10, 5, 200, 4, false);
        mobInfoList[3] = Unit(130, 55, 100, 10, 5, 200, 4, false);
        mobInfoList[4] = Unit(150, 70, 90, 10, 5, 200, 4, false);
        mobInfoList[5] = Unit(220, 120, 120, 10, 5, 200, 4, false);
        mobInfoList[6] = Unit(240, 140, 110, 10, 5, 200, 4, false);
        mobInfoList[7] = Unit(240, 175, 150, 10, 5, 200, 4, false);
        mobInfoList[8] = Unit(400, 180, 210, 10, 5, 200, 4, false);
        mobInfoList[9] = Unit(380, 220, 250, 10, 5, 200, 4, false);
        mobInfoList[10] = Unit(450, 250, 320, 10, 5, 200, 4, false);
        maxMob = 10;

        expSpoiledByMob[1] = 14;
        expSpoiledByMob[2] = 20;
        expSpoiledByMob[3] = 22;
        expSpoiledByMob[4] = 28;
        expSpoiledByMob[5] = 30;
        expSpoiledByMob[6] = 32;
        expSpoiledByMob[7] = 28;
        expSpoiledByMob[8] = 35;
        expSpoiledByMob[9] = 38;
        expSpoiledByMob[10] = 45;

        stageInfoList[1][1].push(1);
        stageInfoList[1][1].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[1][3].push(2);
        stageInfoList[2][1].push(1);
        stageInfoList[2][1].push(1);
        stageInfoList[2][1].push(1);
        stageInfoList[2][2].push(1);
        stageInfoList[2][2].push(1);
        stageInfoList[2][2].push(1);
        stageInfoList[2][3].push(2);
        stageInfoList[2][3].push(2);
        stageInfoList[3][1].push(1);
        stageInfoList[3][1].push(1);
        stageInfoList[3][1].push(2);
        stageInfoList[3][2].push(1);
        stageInfoList[3][2].push(1);
        stageInfoList[3][2].push(2);
        stageInfoList[3][3].push(1);
        stageInfoList[3][3].push(1);
        stageInfoList[3][3].push(2);
        stageInfoList[3][3].push(3);
        maxStage = 3;

        statueAcquisitionStage[1] = 2; // Haetae
        statueAcquisitionStage[2] = 15; // Moai
        statueAcquisitionStage[3] = 30; // Guiliano
        statueAcquisitionStage[4] = 45; // Agrippa
        statueAcquisitionStage[5] = 60; // Weeping Angel
        statueAcquisitionStage[6] = 75; // The Thinker
        statueAcquisitionStage[7] = 90; // Liberty Queen
        statueAcquisitionStage[8] = 105; // General Yi
        statueAcquisitionStage[9] = 120; // Venus
        statueAcquisitionStage[10] = 150; // ???
        statueAcquisitionStage[11] = 180; // ???
        statueAcquisitionStage[12] = 210; // ???
        statueAcquisitionStage[13] = 240; // ???
        statueAcquisitionStage[14] = 270; // ???
        statueAcquisitionStage[15] = 300; // ???
    }

    function addStatueInfo(
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint skillFactor,
        uint skillChargerSize,
        bool skillMultiTargetable
    ) external onlyOwner {
        maxStatue = maxStatue.add(1);
        statueInfoList[maxStatue] = Unit(hp, atk, def, crt, avd, skillFactor, skillChargerSize, skillMultiTargetable);
    }

    function addMobInfo(
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint skillFactor,
        uint skillChargerSize,
        bool skillMultiTargetable,
        uint exp
    ) external onlyOwner {
        maxMob = maxMob.add(1);
        mobInfoList[maxMob] = Unit(hp, atk, def, crt, avd, skillFactor, skillChargerSize, skillMultiTargetable);
        expSpoiledByMob[maxMob] = exp;
    }

    function editStatueInfo(
        uint statueNo,
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint skillFactor,
        uint skillChargerSize,
        bool skillMultiTargetable
    ) external onlyOwner onlyValidStatueNo(statueNo) {
        statueInfoList[statueNo].hp = hp;
        statueInfoList[statueNo].atk = atk;
        statueInfoList[statueNo].def = def;
        statueInfoList[statueNo].crt = crt;
        statueInfoList[statueNo].avd = avd;
        statueInfoList[statueNo].skillFactor = skillFactor;
        statueInfoList[statueNo].skillChargerSize = skillChargerSize;
        statueInfoList[statueNo].skillMultiTargetable = skillMultiTargetable;
    }
    
    function editMobInfo(
        uint mobNo,
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint skillFactor,
        uint skillChargerSize,
        bool skillMultiTargetable,
        uint exp
    ) external onlyOwner onlyValidMobNo(mobNo) {
        mobInfoList[mobNo].hp = hp;
        mobInfoList[mobNo].atk = atk;
        mobInfoList[mobNo].def = def;
        mobInfoList[mobNo].crt = crt;
        mobInfoList[mobNo].avd = avd;
        mobInfoList[mobNo].skillFactor = skillFactor;
        mobInfoList[mobNo].skillChargerSize = skillChargerSize;
        mobInfoList[mobNo].skillMultiTargetable = skillMultiTargetable;
        expSpoiledByMob[mobNo] = exp;
    }

    function increaseMaxStage() external onlyOwner {
        maxStage = maxStage.add(1);
    }

    function editStageRoundInfo(uint stageNo, uint roundNo, uint[] mobNoList)
    public onlyOwner onlyValidStageNo(stageNo) {
        stageInfoList[stageNo][roundNo] = new uint[](mobNoList.length);
        stageInfoList[stageNo][roundNo] = mobNoList;
    }

}