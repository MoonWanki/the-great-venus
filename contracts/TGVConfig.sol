pragma solidity ^0.4.22;

import "./TGVBase.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    event TGVConfigUpdated();

    function setToDefault() public onlyOwner {

        // 석상                                             // 이름            얻는 스테이지
        statueInfoList[1] = UnitInfo(30, 11, 10, 10, 5);    // Guiliano        -
        statueInfoList[2] = UnitInfo(30, 11, 10, 10, 5);    // Moai            2
        statueInfoList[3] = UnitInfo(30, 11, 10, 10, 5);    // Haetae          15
        statueInfoList[4] = UnitInfo(30, 11, 10, 10, 5);    // Agrippa         30
        statueInfoList[5] = UnitInfo(30, 11, 10, 10, 5);    // Mars            45
        statueInfoList[6] = UnitInfo(30, 11, 10, 10, 5);    // Wepping Angle   60
        statueInfoList[7] = UnitInfo(30, 11, 10, 10, 5);    // The Thinker     75
        statueInfoList[8] = UnitInfo(30, 11, 10, 10, 5);    // Liberty Queen   90
        statueInfoList[9] = UnitInfo(30, 11, 10, 10, 5);    // 
        statueInfoList[10] = UnitInfo(30, 11, 10, 10, 5);   // Venus          120
        numStatueInfo = 10;

        emit TGVConfigUpdated();
    }


    function addStageInfo() external onlyOwner returns(uint) {

        numStageInfo.add(1);
        stageInfoList[numStageInfo] = StageInfo([uint(0), 0, 0, 0, 0], [uint(0), 0, 0, 0, 0], [uint(0), 0, 0, 0, 0]);
        emit TGVConfigUpdated();

        return numStageInfo;
    }


    function addStatueInfo(
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner returns(uint) {

        numStatueInfo.add(1);
        statueInfoList[numStatueInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        emit TGVConfigUpdated();

        return numStatueInfo;
    }
    

    function addMonsterInfo(
        uint32 _hp,
        uint32 _atk,
        uint32 _def,
        uint32 _crt,
        uint32 _avd
    ) external onlyOwner returns(uint) {

        numMobInfo.add(1);
        mobInfoList[numMobInfo] = UnitInfo(_hp, _atk, _def, _crt, _avd);
        emit TGVConfigUpdated();

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
        emit TGVConfigUpdated();

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
        emit TGVConfigUpdated();

        return _no;
    }

}