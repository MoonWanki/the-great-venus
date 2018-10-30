pragma solidity ^0.4.24;

import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{    
    function matchWithPlayer(address opponentAddr) external {
        require(users[opponentAddr].rank > users[msg.sender].rank && users[opponentAddr].rank - users[msg.sender].rank <= matchableRankGap);
        uint i;
        uint randNonce;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[opponentAddr].numStatues);
        ourUnits[0] = _getComputedStatue(0, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        for(i = 0 ; i < ourUnits.length ; i++) {
            ourUnits[i] = _getComputedStatue(i, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
        }
        _runBattle(ourUnits, enemyUnits, randNonce);
        users[msg.sender].randNonce++;
        users[opponentAddr].randNonce++;
    }
}