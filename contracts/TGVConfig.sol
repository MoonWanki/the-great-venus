pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVUserBattle.sol";

contract TGVConfig is TGVUserBattle {

    using SafeMath for uint256;

    constructor() public {

        statueInfoList[0] = Unit(300, 120, 90, 10, 5, 200, 4, false);
        statueInfoList[1] = Unit(280, 85, 76, 10, 5, 200, 4, false);
        maxStatue = 1;

        mobInfoList[1] = Unit(100, 25, 80, 10, 5, 200, 4, false);
        mobInfoList[2] = Unit(120, 35, 100, 10, 5, 200, 4, false);
        maxMob = 2;

        expSpoiledByMob[1] = 14;
        expSpoiledByMob[2] = 20;

        stageInfoList[1][1].push(1);
        stageInfoList[1][1].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[1][3].push(2);
        maxStage = 1;

        statueAcquisitionStage[1] = 2; // Haetae
        statueAcquisitionStage[2] = 15; // Moai
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