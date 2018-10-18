pragma solidity ^0.4.22;

import "./TGVBase.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    function setToDefault() public onlyOwner {

        // 석상                                             // 이름            얻는 스테이지
        statueInfoList[1] = UnitInfo(20, 11, 10, 10, 5);    // Guiliano        - 
        statueInfoList[2] = UnitInfo(20, 11, 10, 10, 5);    // Haetae          1 
        statueInfoList[3] = UnitInfo(20, 11, 10, 10, 5);    // Moai            10 
        statueInfoList[4] = UnitInfo(20, 11, 10, 10, 5);    // Agrippa         25 
        statueInfoList[5] = UnitInfo(20, 11, 10, 10, 5);    // Mars            40 
        // statueInfoList[6] = UnitInfo(20, 11, 10, 10, 5);    // Wepping Angle   55 
        // statueInfoList[7] = UnitInfo(20, 11, 10, 10, 5);    // The Thinker     70 
        // statueInfoList[8] = UnitInfo(20, 11, 10, 10, 5);    // Liberty Queen   85 
        // statueInfoList[9] = UnitInfo(20, 11, 10, 10, 5);    // Master Yee     100            
        // statueInfoList[10] = UnitInfo(20, 11, 10, 10, 5);   // Venus          120 
        numStatueInfo = 5;

        // 레벨별 몬스터 능력치
        mobInfoList[1] = UnitInfo(10, 6, 5, 4, 4);
        mobInfoList[2] = UnitInfo(16, 8, 6, 4, 4);
        mobInfoList[3] = UnitInfo(22, 10, 7, 4, 4);
        mobInfoList[4] = UnitInfo(28, 12, 8, 5, 5);
        mobInfoList[5] = UnitInfo(34, 14, 9, 5, 5);
        // mobInfoList[6] = UnitInfo(40, 16, 10, 5, 5);
        // mobInfoList[7] = UnitInfo(46, 18, 11, 6, 6);
        // mobInfoList[8] = UnitInfo(52, 20, 12, 6, 6);
        // mobInfoList[9] = UnitInfo(58, 22, 13, 6, 6);
        // mobInfoList[10] = UnitInfo(64, 24, 14, 7, 7);
        numMobInfo = 5;

        // 스테이지 마다 출현 몬스터 정보
        stageInfoList[1] = [uint8(1),1,0,0,0,1,1,0,0,0,1,1,0,0,0];
        stageInfoList[2] = [uint8(2),2,0,0,0,2,2,2,0,0,2,2,3,0,0];
        stageInfoList[3] = [uint8(3),3,0,0,0,2,3,3,0,0,2,3,3,3,0];
        stageInfoList[4] = [uint8(2),3,4,0,0,2,2,3,4,0,2,2,3,4,0];
        stageInfoList[5] = [uint8(3),3,3,0,0,3,3,3,4,0,1,2,2,3,3];
        // stageInfoList[6] = [uint8(3),3,4,0,0,3,3,3,4,0,3,3,4,4,0];
        // stageInfoList[7] = [uint8(3),4,4,0,0,3,3,4,4,0,3,4,4,5,0];
        // stageInfoList[8] = [uint8(4),4,4,4,0,2,3,3,4,4,3,3,3,3,4];
        // stageInfoList[9] = [uint8(2),3,4,0,0,2,2,3,4,0,2,2,3,4,0];
        // stageInfoList[10] = [uint8(3),3,3,0,0,3,3,3,4,0,1,2,2,3,3];
        numStageInfo = 5;
    }

    function addStageInfo() external onlyOwner returns(uint8) {
        numStageInfo = numStageInfo+1;
        stageInfoList[numStageInfo] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        return numStageInfo;
    }

    function addStatueInfo(
        uint16 _hp,
        uint16 _atk,
        uint16 _def,
        uint16 _crt,
        uint16 _avd
    ) external onlyOwner returns(uint) {

        numStatueInfo = numStatueInfo+1;
        statueInfoList[numStatueInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        return numStatueInfo;
    }

    function addMobInfo(
        uint16 _hp,
        uint16 _atk,
        uint16 _def,
        uint16 _crt,
        uint16 _avd
    ) external onlyOwner returns(uint) {

        numMobInfo = numMobInfo+1;
        mobInfoList[numMobInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        return numMobInfo;
    }



    function editStatueInfo(
        uint _no,
        uint16 _hp,
        uint16 _atk,
        uint16 _def,
        uint16 _crt,
        uint16 _avd
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
        uint16 _hp,
        uint16 _atk,
        uint16 _def,
        uint16 _crt,
        uint16 _avd
    ) external onlyOwner onlyValidStatueNo(_no) returns(uint) {

        mobInfoList[_no].hp = _hp;
        mobInfoList[_no].atk = _atk;
        mobInfoList[_no].def = _def;
        mobInfoList[_no].crt = _crt;
        mobInfoList[_no].avd = _avd;
        return _no;
    }

}