pragma solidity ^0.4.24;

import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    function matchWithPlayer(address enemyAddr) external {
        uint i;
        uint randNonce;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[enemyAddr].numStatues);
        for(i = 0 ; i < ourUnits.length ; i++) {
            ourUnits[i] = _getComputedStatue(i, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[enemyAddr].level, statueEquipInfo[enemyAddr][i]);
        }
        _runBattle(ourUnits, enemyUnits, randNonce);
        users[msg.sender].randNonce++;
        users[enemyAddr].randNonce++;
    }
}