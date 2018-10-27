pragma solidity ^0.4.22;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    constructor() public {
        
        statueInfoList[0] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[1] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[2] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[3] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[4] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[5] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[6] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[7] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[8] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[9] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[10] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[11] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[12] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[13] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[14] = UnitInfo(20, 11, 10, 10, 5);
        statueInfoList[15] = UnitInfo(20, 11, 10, 10, 5);
        maxStatue = 15;

        mobInfoList[1] = UnitInfo(10, 6, 5, 4, 4);
        mobInfoList[2] = UnitInfo(16, 8, 6, 4, 4);
        mobInfoList[3] = UnitInfo(50, 10, 7, 4, 4);
        mobInfoList[4] = UnitInfo(28, 12, 8, 5, 5);
        mobInfoList[5] = UnitInfo(34, 14, 9, 5, 5);
        mobInfoList[6] = UnitInfo(40, 16, 10, 5, 5);
        mobInfoList[7] = UnitInfo(46, 18, 11, 6, 6);
        mobInfoList[8] = UnitInfo(52, 20, 12, 6, 6);
        mobInfoList[9] = UnitInfo(58, 22, 13, 6, 6);
        mobInfoList[10] = UnitInfo(64, 24, 14, 7, 7);
        maxMob = 5;

        stageInfoList[1][1].push(1);
        stageInfoList[1][1].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][2].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[1][3].push(1);
        stageInfoList[2][1].push(2);
        stageInfoList[2][1].push(2);
        stageInfoList[2][2].push(2);
        stageInfoList[2][2].push(2);
        stageInfoList[2][2].push(2);
        stageInfoList[2][3].push(2);
        stageInfoList[2][3].push(2);
        stageInfoList[2][3].push(3);
        stageInfoList[3][1].push(3);
        stageInfoList[3][1].push(3);
        stageInfoList[3][2].push(2);
        stageInfoList[3][2].push(3);
        stageInfoList[3][2].push(3);
        stageInfoList[3][3].push(2);
        stageInfoList[3][3].push(3);
        stageInfoList[3][3].push(3);
        stageInfoList[3][3].push(3);
        maxStage = 3;

        extraHpPerUnitLevel = 3;
        extraAtkPerUnitLevel = 2;
        extraDefPerUnitLevel = 1;
        extraHpPerEquipLevel = 20;
        extraAtkPerEquipLevel = 10;
        extraDefPerEquipLevel = 8;
        extraCrtPerEquipLevel = 10;
        extraAvdPerEquipLevel = 5;

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

    function addStatueInfo(uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd) external onlyOwner {
        maxStatue = maxStatue.add(1);
        statueInfoList[maxStatue] = UnitInfo(hp, atk, def, crt, avd);
    }

    function addMobInfo(uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd) external onlyOwner {
        maxMob = maxMob.add(1);
        mobInfoList[maxMob] = UnitInfo(hp, atk, def, crt, avd);
    }

    function addStageInfo(uint8[] mobNoList1, uint8[] mobNoList2, uint8[] mobNoList3) public onlyOwner {
        maxStage = maxStage.add(1);
        stageInfoList[maxStage][1] = mobNoList1;
        stageInfoList[maxStage][2] = mobNoList2;
        stageInfoList[maxStage][3] = mobNoList3;
    }

    function editStatueInfo(uint statueNo, uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd)
    public onlyOwner onlyValidStatueNo(statueNo) {
        statueInfoList[statueNo].hp = hp;
        statueInfoList[statueNo].atk = atk;
        statueInfoList[statueNo].def = def;
        statueInfoList[statueNo].crt = crt;
        statueInfoList[statueNo].avd = avd;
    }
    
    function editMobInfo(uint mobNo, uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd)
    public onlyOwner onlyValidMobNo(mobNo) {
        mobInfoList[mobNo].hp = hp;
        mobInfoList[mobNo].atk = atk;
        mobInfoList[mobNo].def = def;
        mobInfoList[mobNo].crt = crt;
        mobInfoList[mobNo].avd = avd;
    }

    function editStageInfo(uint stageNo, uint8[15] stageInfo)
    public onlyOwner onlyValidStageNo(stageNo) {
        stageInfoList[stageNo][1] = [stageInfo[0], stageInfo[1], stageInfo[2], stageInfo[3], stageInfo[4]];
        stageInfoList[stageNo][2] = [stageInfo[5], stageInfo[6], stageInfo[7], stageInfo[8], stageInfo[9]];
        stageInfoList[stageNo][3] = [stageInfo[10], stageInfo[11], stageInfo[12], stageInfo[13], stageInfo[14]];
    }

    function editStageRoundInfo(uint stageNo, uint roundNo, uint8[] mobNoList)
    external onlyOwner onlyValidStageNo(stageNo) {
        stageInfoList[stageNo][roundNo] = mobNoList;
    }

}