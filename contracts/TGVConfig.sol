pragma solidity ^0.4.22;

import "./TGVBase.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    function setToDefault() public onlyOwner {

        // 석상                                             // 이름            얻는 스테이지
        statueInfoList[1] = UnitInfo(20, 11, 10, 10, 5);    // Guiliano        - 
        statueInfoList[2] = UnitInfo(20, 11, 10, 10, 5);    // Haetae          1 
        statueInfoList[3] = UnitInfo(20, 11, 10, 10, 5);    // Moai            15 
        statueInfoList[4] = UnitInfo(20, 11, 10, 10, 5);    // Agrippa         30 
        statueInfoList[5] = UnitInfo(20, 11, 10, 10, 5);    // Mars            45 
        statueInfoList[6] = UnitInfo(20, 11, 10, 10, 5);    // Wepping Angle   60 
        statueInfoList[7] = UnitInfo(20, 11, 10, 10, 5);    // The Thinker     75 
        statueInfoList[8] = UnitInfo(20, 11, 10, 10, 5);    // Liberty Queen   90 
        statueInfoList[9] = UnitInfo(20, 11, 10, 10, 5);    // Master Yee     105            
        statueInfoList[10] = UnitInfo(20, 11, 10, 10, 5);   // Venus          120 
        numStatueInfo = 10;

        // 레벨별 몬스터 능력치
        mobInfoList[1] = UnitInfo(20, 6, 5, 4, 4);
        mobInfoList[2] = UnitInfo(26, 8, 6, 4, 4);
        mobInfoList[3] = UnitInfo(32, 10, 7, 4, 4);
        mobInfoList[4] = UnitInfo(38, 12, 8, 5, 5);
        mobInfoList[5] = UnitInfo(44, 14, 9, 5, 5);
        mobInfoList[6] = UnitInfo(50, 16, 10, 5, 5);
        mobInfoList[7] = UnitInfo(56, 18, 11, 6, 6);
        mobInfoList[8] = UnitInfo(62, 20, 12, 6, 6);
        mobInfoList[9] = UnitInfo(68, 22, 13, 6, 6);
        mobInfoList[10] = UnitInfo(74, 24, 14, 7, 7);
        numMobInfo = 10;

        // 스테이지 마다 출현 몬스터 정보
        stageInfoList[1] = [uint(1),1,0,0,0,1,1,0,0,0,1,1,0,0,0];
        stageInfoList[2] = [uint(2),2,0,0,0,2,2,2,0,0,2,2,3,0,0];
        stageInfoList[3] = [uint(3),3,0,0,0,2,3,3,0,0,2,3,3,3,0];
        stageInfoList[4] = [uint(3),3,4,0,0,3,3,3,4,0,3,3,3,3,4];
        stageInfoList[5] = [uint(3),4,4,0,0,3,4,4,4,4,3,3,4,4,4];
        numStageInfo = 5;

        // 레벨 업 마다 필요한 경험치 정보
        requiredExp[1] = 0;
        requiredExp[2] = 1000;
        requiredExp[3] = 3000;
        requiredExp[4] = 6000;
        requiredExp[5] = 10000;
        requiredExp[6] = 15000;
        requiredExp[7] = 21000;
        requiredExp[8] = 28000;
        requiredExp[9] = 36000;
        requiredExp[10] = 45000;
        requiredExp[11] = 55000;
        requiredExp[12] = 65000;
        requiredExp[13] = 75000;
        requiredExp[14] = 85000;
        requiredExp[15] = 100000;
        numRequiredExp = 15; 
    }

    // function getHpequipvalue(uint level, ) view
    // {

    // }
    // function getHpequipvalue(uint level, ) view
    // {

    // }
    // function getHpequipvalue(uint level, ) view
    // {

    // }

    function addStageInfo() external onlyOwner returns(uint) {

        numStageInfo = numStageInfo.add(1);
        stageInfoList[numStageInfo] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        return numStageInfo;
    }


    function addStatueInfo(
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner returns(uint) {

        numStatueInfo = numStatueInfo.add(1);
        statueInfoList[numStatueInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        return numStatueInfo;
    }
    

    function addMobInfo(
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner returns(uint) {

        numMobInfo = numMobInfo.add(1);
        mobInfoList[numMobInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        return numMobInfo;
    }

    // function editStageInfo(uint _no) external onlyOwner onlyValidStageNo(_no) returns() {
    // }

    function editStatueInfo(
        uint _no,
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner onlyValidStatueNo(_no) returns(uint) {

        statueInfoList[_no].hp = _hp;
        statueInfoList[_no].atk = _atk;
        statueInfoList[_no].def = _def;
        statueInfoList[_no].crt = _crt;
        statueInfoList[_no].avd = _avd;
        return _no;
    }
    
    
    function editMobInfo(
        uint _no,
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner onlyValidStatueNo(_no) returns(uint) {

        mobInfoList[_no].hp = _hp;
        mobInfoList[_no].atk = _atk;
        mobInfoList[_no].def = _def;
        mobInfoList[_no].crt = _crt;
        mobInfoList[_no].avd = _avd;
        return _no;
    }

}