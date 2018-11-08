pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    using SafeMath for uint;

    event AttackResult1on1(bool way, uint damage, bool isCrt);
    event Result1on1(bool victory, uint ourIdx, uint enemyIdx);

    // uint public deadline = block.timestamp;

    // function distributeReward() public onlyOwner {
    //     require(numUsers >= 10 && block.timestamp > deadline);
    //     uint i = 1;
    //     uint balance = address(this).balance;
    //     uint numforPlat = (balance).div(numUsers);
    //     uint numforDia = numforPlat.mul(2);
    //     uint numforGold = numforPlat.div(2);
    //     owner.transfer(balance/20);
    //     for(;i<=numUsers/10;) rankToOwner[i++].transfer(numforDia);
    //     for(;i<=numUsers*3/10;) rankToOwner[i++].transfer(numforPlat);
    //     for(;i<=numUsers*7/10;) rankToOwner[i++].transfer(numforGold);
    //     deadline = block.timestamp + 10 minutes;
    // }

    function matchWithPlayer(address opponentAddr) external {
        require(users[opponentAddr].rank < users[msg.sender].rank && users[msg.sender].rank - users[opponentAddr].rank <= matchableRankGap);
        uint i;
        uint randNonce;
        bool win;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[opponentAddr].numStatues);
        ourUnits[ourUnits.length - 1] = _getComputedStatue(0, users[msg.sender].level, statueEquipInfo[msg.sender][0]);  
        enemyUnits[enemyUnits.length - 1] = _getComputedStatue(0, users[opponentAddr].level, statueEquipInfo[opponentAddr][0]);
        for(i = 0 ; i < ourUnits.length-1 ; i++) {
            ourUnits[i] = _getComputedStatue(i+1, users[msg.sender].level, statueEquipInfo[msg.sender][i+1]);
        }
        for(i = 0 ; i < enemyUnits.length-1 ; i++) {
            enemyUnits[i] = _getComputedStatue(i+1, users[opponentAddr].level, statueEquipInfo[opponentAddr][i+1]);
        }
        win = _runBattleWithOtherUsers(ourUnits, enemyUnits, randNonce);
        users[msg.sender].randNonce++;
        users[opponentAddr].randNonce++;
        if(win)
        {
            uint32 myRank = users[msg.sender].rank;
            uint32 enemyRank = users[opponentAddr].rank;
            users[opponentAddr].rank = myRank;
            users[msg.sender].rank = enemyRank;
            rankToOwner[myRank] = opponentAddr;
            rankToOwner[enemyRank] = msg.sender;
        }
    }

    function _runBattleWithOtherUsers(Unit[] memory ourUnits, Unit[] memory enemyUnits, uint nonce) internal returns(bool){
        uint ourIdx = 0;
        uint enemyIdx = 0;
        uint randNonce = nonce;
        bool win;
        while(true){
            (win, randNonce) = _1on1Battle(ourUnits[ourIdx], enemyUnits[enemyIdx], randNonce);
            emit Result1on1(win, ourIdx, enemyIdx);
            if(win) enemyIdx = enemyIdx.add(1);
            if(!win) ourIdx = ourIdx.add(1);
            if(ourIdx == ourUnits.length) return false;
            if(enemyIdx == enemyUnits.length) return true;
        }
    }
    function _1on1Battle(Unit memory ourUnit, Unit memory enemyUnit, uint nonce) internal returns(bool, uint){
        bool isCrt;
        uint damage;
        uint randNonce = nonce;
        while(true){
            if(ourUnit.hp > 0){
                (damage, isCrt, enemyUnit, randNonce) = _attack(ourUnit, enemyUnit, randNonce);
                emit AttackResult1on1(true, damage, isCrt);
            }
            if(enemyUnit.hp > 0){
                (damage, isCrt, ourUnit, randNonce) = _attack(enemyUnit, ourUnit, randNonce);
                emit AttackResult1on1(false, damage, isCrt); 
            }
            if(ourUnit.hp == 0) return (false, randNonce);
            if(enemyUnit.hp == 0) return (true, randNonce);
        }
    } 
}