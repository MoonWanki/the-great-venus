pragma solidity ^0.4.22;

import "./TGVBase.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVConfig is TGVBase {

    using SafeMath for uint256;

    // statueInfoList[1] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Guiliano
    // statueInfoList[2] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Moai
    // statueInfoList[3] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Agrippa
    // statueInfoList[4] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Ariadne
    // statueInfoList[5] = UnitInfo(_hp, _atk, _def, _crt, _avd); // David
    // statueInfoList[6] = UnitInfo(_hp, _atk, _def, _crt, _avd); // The Thinker
    // statueInfoList[7] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Weeping Angel
    // statueInfoList[8] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Queen of Liberty
    // statueInfoList[9] = UnitInfo(_hp, _atk, _def, _crt, _avd); // Venus

    function addStageInfo() external onlyOwner returns(uint) {
        numStageInfo.add(1);
        stageInfoList[numStageInfo] = StageInfo([uint(0), 0, 0, 0, 0], [uint(0), 0, 0, 0, 0], [uint(0), 0, 0, 0, 0]);
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