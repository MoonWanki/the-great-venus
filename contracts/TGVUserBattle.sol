pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    using SafeMath for uint;

    event PvPResult(address indexed _from, address indexed _to, bool victory, uint lowRank, uint highRank);

    uint public nextRefundTime = block.timestamp;
    uint public refundPeriod = 15 minutes;

    uint public matchableRankGap = 10;

    uint public cutForDiamond = 1;
    uint public cutForPlatinum = 3;
    uint public cutForGold = 7;
    uint public cutForSilver = 9;

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
        require(opponentAddr != msg.sender);
        require(users[opponentAddr].rank < users[msg.sender].rank && users[msg.sender].rank - users[opponentAddr].rank <= matchableRankGap);
        uint i;
        bool victory;
        uint32 myRank = users[msg.sender].rank;
        uint32 enemyRank = users[opponentAddr].rank;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[opponentAddr].numStatues);
        for(i = 0 ; i < ourUnits.length ; i++) {
            ourUnits[i] = _getComputedStatue(i, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
            emit RoundUnitInfo(true, i, ourUnits[i].hp, ourUnits[i].atk, ourUnits[i].def, ourUnits[i].crt, ourUnits[i].avd);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
            emit RoundUnitInfo(false, i, enemyUnits[i].hp, enemyUnits[i].atk, enemyUnits[i].def, enemyUnits[i].crt, enemyUnits[i].avd);
        }
        (victory,) = _runBattle(ourUnits, enemyUnits, 0);
        if(victory) {
            users[opponentAddr].rank = myRank;
            users[msg.sender].rank = enemyRank;
            rankToOwner[myRank] = opponentAddr;
            rankToOwner[enemyRank] = msg.sender;
            emit PvPResult(msg.sender, opponentAddr, true, myRank, enemyRank);
        } else {
            emit PvPResult(msg.sender, opponentAddr, false, myRank, enemyRank);
        }
        users[msg.sender].randNonce++;
        users[opponentAddr].randNonce++;
    }
}