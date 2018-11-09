pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    using SafeMath for uint;

    // event AttackResult1on1(bool way, uint damage, bool isCrt);
    // event Result1on1(bool victory, uint ourIdx, uint enemyIdx);

    uint public nextRefundTime = block.timestamp;
    uint public refundPeriod = 15 minutes;

    uint matchableRankGap = 10;

    uint cutForDiamond = 1;
    uint cutForPlatinum = 3;
    uint cutForGold = 7;
    uint cutForSilver = 9;

    function refundFinney() public onlyOwner {
        require(numUsers >= 10 && block.timestamp > nextRefundTime);
        uint i = 1;
        uint quotaForDiamond;
        uint quotaForPlatinum;
        uint quotaForGold;
        (quotaForDiamond, quotaForPlatinum, quotaForGold) = getQuota();
        owner.transfer(address(this).balance/20);
        for(;i<=cutForDiamond;) rankToOwner[i++].transfer(quotaForDiamond);
        for(;i<=cutForPlatinum/10;) rankToOwner[i++].transfer(quotaForPlatinum);
        for(;i<=cutForGold;) rankToOwner[i++].transfer(quotaForGold);
        cutForDiamond = numUsers.div(10);
        cutForPlatinum = numUsers.mul(3).div(10);
        cutForGold = numUsers.mul(7).div(10);
        nextRefundTime = block.timestamp + refundPeriod;
    }

    function getQuota() public view returns(uint, uint, uint) {
        return (
            address(this).balance.div(numUsers).mul(2),
            address(this).balance.div(numUsers),
            address(this).balance.div(numUsers)/2
        );
    }

    function matchWithPlayer(address opponentAddr) external {
        require(users[opponentAddr].rank < users[msg.sender].rank && users[msg.sender].rank - users[opponentAddr].rank <= matchableRankGap);
        uint i;
        bool victory;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[opponentAddr].numStatues);
        // ourUnits[ourUnits.length - 1] = _getComputedStatue(0, users[msg.sender].level, statueEquipInfo[msg.sender][0]);  
        // enemyUnits[enemyUnits.length - 1] = _getComputedStatue(0, users[opponentAddr].level, statueEquipInfo[opponentAddr][0]);
        for(i = 0 ; i < ourUnits.length ; i++) {
            ourUnits[i] = _getComputedStatue(i, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
        }
        (victory,) = _runBattle(ourUnits, enemyUnits, 0);
        if(victory) {
            uint32 myRank = users[msg.sender].rank;
            uint32 enemyRank = users[opponentAddr].rank;
            users[opponentAddr].rank = myRank;
            users[msg.sender].rank = enemyRank;
            rankToOwner[myRank] = opponentAddr;
            rankToOwner[enemyRank] = msg.sender;
            emit RoundResult(true, 0, 0);
        } else {
            emit RoundResult(false, 0, 0);
        }
        // win = _runBattleWithOtherUsers(ourUnits, enemyUnits, randNonce);
        users[msg.sender].randNonce++;
        users[opponentAddr].randNonce++;
    }

    // function _runBattleWithOtherUsers(Unit[] memory ourUnits, Unit[] memory enemyUnits, uint nonce) internal returns(bool){
    //     uint ourIdx = 0;
    //     uint enemyIdx = 0;
    //     uint randNonce = nonce;
    //     bool win;
    //     while(true){
    //         (win, randNonce) = _1on1Battle(ourUnits[ourIdx], enemyUnits[enemyIdx], randNonce);
    //         emit Result1on1(win, ourIdx, enemyIdx);
    //         if(win) enemyIdx = enemyIdx.add(1);
    //         if(!win) ourIdx = ourIdx.add(1);
    //         if(ourIdx == ourUnits.length) return false;
    //         if(enemyIdx == enemyUnits.length) return true;
    //     }
    // }
    // function _1on1Battle(Unit memory ourUnit, Unit memory enemyUnit, uint nonce) internal returns(bool, uint){
    //     bool isCrt;
    //     uint damage;
    //     uint randNonce = nonce;
    //     while(true){
    //         if(ourUnit.hp > 0){
    //             (damage, isCrt, enemyUnit, randNonce) = _attack(ourUnit, enemyUnit, randNonce);
    //             emit AttackResult1on1(true, damage, isCrt);
    //         }
    //         if(enemyUnit.hp > 0){
    //             (damage, isCrt, ourUnit, randNonce) = _attack(enemyUnit, ourUnit, randNonce);
    //             emit AttackResult1on1(false, damage, isCrt); 
    //         }
    //         if(ourUnit.hp == 0) return (false, randNonce);
    //         if(enemyUnit.hp == 0) return (true, randNonce);
    //     }
    // } 
}