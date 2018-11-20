pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop
{
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath8 for uint8;

    uint public damageMulFactor = 200;
    uint public damageDivFactor = 100;
    uint public damageFlexibler = 7;

    event RoundUnitInfo(bool isAlly, uint no, uint hp, uint atk, uint def, uint crt, uint avd);
    event AttackResult(bool way, uint from, uint to, uint damage, bool isCrt);
    event RoundResult(bool victory, uint exp, uint sorbiote);
    
    function clearStage(uint stageNo, uint[] statueNoList) external onlyValidStageNo(stageNo) {
        require(users[msg.sender].lastStage + 1 >= stageNo);
        uint i;
        for(i = 0 ; i < statueNoList.length ; i++) require(statueNoList[i] < users[msg.sender].numStatues);
        bool victory;
        uint roundNo = 1;
        uint roundExp;
        uint randNonce = 0;
        User memory user = users[msg.sender];
        Unit[] memory ourUnits = new Unit[](statueNoList.length);
        while(true) {
            roundExp = 0;
            if(stageInfoList[stageNo][roundNo].length == 0) break;
            Unit[] memory enemyUnits = new Unit[](stageInfoList[stageNo][roundNo].length);
            for(i = 0 ; i < ourUnits.length ; i++) {
                ourUnits[i] = _getComputedStatue(statueNoList[i], user.level, statueEquipInfo[msg.sender][statueNoList[i]]);
                _emitRoundUnitInfo(true, statueNoList[i], ourUnits[i]);
            }
            for(i = 0 ; i < enemyUnits.length ; i++) {
                enemyUnits[i] = _getComputedMob(stageInfoList[stageNo][roundNo][i], stageNo);
                roundExp += expSpoiledByMob[stageInfoList[stageNo][roundNo][i]];
                _emitRoundUnitInfo(false, stageInfoList[stageNo][roundNo][i], enemyUnits[i]);
            }
            (victory, randNonce) = _runBattle(ourUnits, enemyUnits, randNonce);
            if(victory) {
                user.exp = user.exp.add(uint32(roundExp));
                if(user.exp >= getRequiredExp(user.level)) user.level = user.level.add(1);
                user.sorbiote = user.sorbiote.add(uint32(enemyUnits.length));
                emit RoundResult(true, roundExp, enemyUnits.length);
            } else {
                emit RoundResult(false, 0, 0);
                break;
            }
            roundNo++;
        }
        user.randNonce++;
        if(victory && user.lastStage < stageNo) {
            user.lastStage = uint32(stageNo);
            if(statueAcquisitionStage[user.numStatues] == stageNo) user.numStatues = user.numStatues.add(1);
        }
        users[msg.sender] = user;
    }

    function _emitRoundUnitInfo(bool isAlly, uint no, Unit unit) internal {
        emit RoundUnitInfo(isAlly, no, unit.hp, unit.atk, unit.def, unit.crt, unit.avd);
    }

    function _runBattle(Unit[] memory ourUnits, Unit[] memory enemyUnits, uint nonce) internal returns(bool, uint) {
        bool isCrt;
        uint i;
        uint damage;
        uint targetIdx;
        uint randNonce = nonce;
        uint upperBound = ourUnits.length > enemyUnits.length ? ourUnits.length : enemyUnits.length;
        while(true) {
            for(i = 0 ; i < upperBound ; i++) {
                if(i < ourUnits.length && ourUnits[i].hp > 0) {
                    targetIdx = _selectTarget(i, enemyUnits);
                    if(targetIdx!=404) {
                        (damage, isCrt, enemyUnits[targetIdx], randNonce) = _attack(ourUnits[i], enemyUnits[targetIdx], randNonce);
                        emit AttackResult(true, i, targetIdx, damage, isCrt);
                    }
                }
                if(i < enemyUnits.length && enemyUnits[i].hp > 0) {
                    targetIdx = _selectTarget(i, ourUnits);
                    if(targetIdx!=404) {
                        (damage, isCrt, ourUnits[targetIdx], randNonce) = _attack(enemyUnits[i], ourUnits[targetIdx], randNonce);
                        emit AttackResult(false, i, targetIdx, damage, isCrt);
                    }
                }
            }
            if(_hasDefeated(ourUnits)) return (false, randNonce);
            if(_hasDefeated(enemyUnits)) return (true, randNonce);
        }
    }

    function _attack(Unit memory attacker, Unit memory opponent, uint randNonce) internal view returns(uint, bool, Unit, uint) {
        if(uint(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender, randNonce))) % 100 < opponent.avd)
            return (0, false, opponent, randNonce + 1);
        bool isCrt = uint(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender, randNonce+1))) % 100 < attacker.crt;
        uint damage = attacker.atk.mul(damageMulFactor).div(opponent.def.add(damageDivFactor));
        damage += uint(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender, randNonce+2))) % (damage/damageFlexibler + 1) + 1;
        damage *= isCrt ? 2 : 1;
        opponent.hp = opponent.hp < damage ? 0 : opponent.hp - damage;
        return (damage, isCrt, opponent, randNonce + 3);
    }

    function _selectTarget(uint myIdx, Unit[] memory opponentUnits) internal pure returns(uint) {
        if(myIdx >= opponentUnits.length || opponentUnits[myIdx].hp == 0) {
            for(uint i = 0 ; i < opponentUnits.length ; i++) {
                if(opponentUnits[i].hp > 0) return i;
            }
            return 404;
        } else return myIdx;
    }

    function _hasDefeated(Unit[] units) internal pure returns(bool) {
        for(uint i = 0 ; i < units.length ; i++) if(units[i].hp > 0) return false;
        return true;
    }

    function _getComputedStatue(uint statueNo, uint level, EquipInfo memory equipInfo) internal view returns(Unit) {
        uint rawHp;
        uint rawAtk;
        uint rawDef;
        uint rawCrt;
        uint rawAvd;
        (rawHp, rawAtk, rawDef, rawCrt, rawAvd) = getStatueRawSpec(statueNo, level);
        return Unit(
            rawHp.add(getExtraValueByEquip(statueNo, 1, equipInfo.hpEquipLevel)),
            rawAtk.add(getExtraValueByEquip(statueNo, 2, equipInfo.atkEquipLevel)),
            rawDef.add(getExtraValueByEquip(statueNo, 3, equipInfo.defEquipLevel)),
            rawCrt.add(getExtraValueByEquip(statueNo, 4, equipInfo.crtEquipLevel)),
            rawAvd.add(getExtraValueByEquip(statueNo, 5, equipInfo.avdEquipLevel))
        );
    }

    function _getComputedMob(uint mobNo, uint level) internal view returns(Unit) {
        uint rawHp;
        uint rawAtk;
        uint rawDef;
        uint rawCrt;
        uint rawAvd;
        (rawHp, rawAtk, rawDef, rawCrt, rawAvd) = getMobRawSpec(mobNo, level);
        return Unit(
            rawHp,
            rawAtk,
            rawDef,
            rawCrt,
            rawAvd
        );
    }

    function editDamageFactor(uint _damageMulFactor, uint _damageDivFactor, uint _damageFlexibler) external onlyOwner {
        damageMulFactor = _damageMulFactor;
        damageDivFactor = _damageDivFactor;
        damageFlexibler = _damageFlexibler;
    }
}