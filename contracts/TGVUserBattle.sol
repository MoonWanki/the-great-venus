pragma solidity ^0.4.22;

import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    function matchWithPlayer(address enemyAddr) external {
        uint i;
        uint randNonce;
        UnitInfo[] memory ourUnits = new UnitInfo[](users[msg.sender].numStatues);
        UnitInfo[] memory enemyUnits = new UnitInfo[](users[enemyAddr].numStatues);
        for(i = 0 ; i < ourUnits.length ; i++) {
            ourUnits[i] = _getComputedStatue(i, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[enemyAddr].level, statueEquipInfo[msg.sender][i]);
        }
        _runBattle(ourUnits, enemyUnits, randNonce);
        users[msg.sender].randNonce++;
        users[enemyAddr].randNonce++;
    }
}