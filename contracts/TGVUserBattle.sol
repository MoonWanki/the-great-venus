pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{
    using SafeMath for uint;

    event PvPResult(address indexed _from, address indexed _to, string userName, string opponentName, bool victory, uint finalUserRank, uint finalOpponentRank);
    event Refund(uint quotaForDiamond, uint quotaForPlatinum, uint quotaForGold);

    uint public nextRefundTime = block.timestamp;
    uint public refundPeriod = 1 hours;

    uint public matchableRankGap = 10;

    uint public cutForDiamond = 1;
    uint public cutForPlatinum = 3;
    uint public cutForGold = 7;
    uint public cutForSilver = 9;

    function refund() public onlyOwner {
        require(numUsers >= 10 && block.timestamp > nextRefundTime);
        uint i = 1;
        uint quotaForDiamond;
        uint quotaForPlatinum;
        uint quotaForGold;
        (quotaForDiamond, quotaForPlatinum, quotaForGold) = getQuota();
        owner.transfer(address(this).balance/20);
        emit Refund(quotaForDiamond, quotaForPlatinum, quotaForGold);
        for(;i<=cutForDiamond;) rankToOwner[i++].transfer(quotaForDiamond);
        for(;i<=cutForPlatinum/10;) rankToOwner[i++].transfer(quotaForPlatinum);
        for(;i<=cutForGold;) rankToOwner[i++].transfer(quotaForGold);
        cutForDiamond = numUsers.div(10);
        cutForPlatinum = numUsers.mul(3).div(10);
        cutForGold = numUsers.mul(7).div(10);
        cutForSilver = numUsers.mul(9).div(10);
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
            _emitRoundUnitInfo(true, i, ourUnits[i]);
        }
        for(i = 0 ; i < enemyUnits.length ; i++) {
            enemyUnits[i] = _getComputedStatue(i, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
            _emitRoundUnitInfo(false, i, enemyUnits[i]);
        }
        (victory,) = _runBattle(ourUnits, enemyUnits, 0);
        if(victory) {
            users[opponentAddr].rank = myRank;
            users[msg.sender].rank = enemyRank;
            rankToOwner[myRank] = opponentAddr;
            rankToOwner[enemyRank] = msg.sender;
            emit PvPResult(msg.sender, opponentAddr, users[msg.sender].name, users[opponentAddr].name, true, myRank, enemyRank);
        } else {
            emit PvPResult(msg.sender, opponentAddr, users[msg.sender].name, users[opponentAddr].name, false, myRank, enemyRank);
        }
        users[msg.sender].randNonce++;
        users[opponentAddr].randNonce++;
    }

    function editRefundConfig(uint _refundPeriod, uint _matchableRankGap) external onlyOwner {
        refundPeriod = _refundPeriod;
        matchableRankGap = _matchableRankGap;
    }
}