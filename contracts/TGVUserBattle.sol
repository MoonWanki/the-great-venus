pragma solidity ^0.4.24;

import "./TGVStageClear.sol";

contract TGVUserBattle is TGVStageClear 
{    
    event AttackResult1on1(bool way, uint damage, bool isCrt);
    event Result1on1(bool victory, uint ourIdx, uint enemyIdx);

    function matchWithPlayer(address opponentAddr) external {
        require(users[opponentAddr].rank > users[msg.sender].rank && users[opponentAddr].rank - users[msg.sender].rank <= matchableRankGap);
        uint i;
        uint randNonce;
        bool win;
        Unit[] memory ourUnits = new Unit[](users[msg.sender].numStatues);
        Unit[] memory enemyUnits = new Unit[](users[opponentAddr].numStatues);
        ourUnits[users[msg.sender].numStatues-1] = _getComputedStatue(0, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        enemyUnits[users[opponentAddr].numStatues-1] = _getComputedStatue(0, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
        for(i = 0 ; i < ourUnits.length-1 ; i++) {
            ourUnits[i] = _getComputedStatue(i+1, users[msg.sender].level, statueEquipInfo[msg.sender][i]);
        }
        for(i = 0 ; i < enemyUnits.length-1 ; i++) {
            enemyUnits[i] = _getComputedStatue(i+1, users[opponentAddr].level, statueEquipInfo[opponentAddr][i]);
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
            if(win) enemyIdx.add(1);
            if(!win) ourIdx.add(1);
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

// interface Aion
contract Aion {
    uint256 public serviceFee;
    function ScheduleCall
    (
        uint256 blocknumber, address to, uint256 value, uint256 gaslimit, uint256 gasprice, bytes data, bool schedType
        ) public payable returns (uint,address);

}

// Main contract
contract Scheduler is TGVUserBattle{
    uint256 public sqrtValue;
    Aion aion;

    constructor(uint256 number) public payable {
        distributedReward(number);
        scheduleMyfucntion(number);
    }

    function scheduleMyfucntion(uint256 number) public {
        aion = Aion(0xFcFB45679539667f7ed55FA59A15c8Cad73d9a4E);
        bytes memory data = abi.encodeWithSelector(bytes4(keccak256("distributedReward(uint256)")),number); 
        uint callCost = 200000*1e9 + aion.serviceFee();
        aion.ScheduleCall.value(callCost)(block.timestamp + 1 minutes, address(this), 0, 200000, 1e9, data, true);
    }

    function distributedReward(uint256 number) public {
        // do your task here and call again the function to schedule
        uint i;
        uint[] memory rewardBalance;
        rewardBalance[0] = address(this).balance/4;                //보상금의 25퍼
        rewardBalance[1] = address(this).balance*3/10;             //보상금의 30퍼
        rewardBalance[2] = address(this).balance*4/10;             //보상금의 40퍼
        for(i = 0 ; i < numUsers/10 ; i++){
            rankToOwner[i].transfer(rewardBalance[0]/(numUsers/10));    //다이아 멤버 보상 송금
        }
        for(i = numUsers/10 ; i < numUsers*3/10 ; i++){
            rankToOwner[i].transfer(rewardBalance[1]/(numUsers*2/10));  //플레티넘 멤버 보상 송금
        }
        for(i = numUsers*3/10 ; i < numUsers*7/10 ; i++){
            rankToOwner[i].transfer(rewardBalance[2]/(numUsers*4/10));  //골드 멤버 보상 송금
        }
        scheduleMyfucntion(number);
    } 

    function () public payable {}
}