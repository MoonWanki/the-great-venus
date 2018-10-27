pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVStageClear is TGVBase
{
    using SafeMath for uint256;

    event AttackResult(bool way, uint8 unit, uint8 mob, uint damage, bool isCrt);
    event RoundResult(bool victory, uint exp, uint8 gem);

    function clearStage(uint stageNo, uint[] statueNoList) external {
        bool victory;
        uint i;
        uint j;
        uint randNonce = 0;
        UnitInfo[] memory ourUnits = new UnitInfo[](statueNoList.length);
        for(i = 0 ; i < statueNoList.length ; i++) require(statueNoList[i] < users[msg.sender].numStatues);
        for(i = 1 ; i <= 3 ; i++) {
            if(stageInfoList[stageNo][i].length == 0) break;
            UnitInfo[] memory enemyUnits = new UnitInfo[](stageInfoList[stageNo][i].length);
            for(j = 0 ; j < ourUnits.length ; j++) {
                ourUnits[j] = _getComputedStatue(statueNoList[j], users[msg.sender].level, statueEquipInfo[msg.sender][statueNoList[j]]);
            }
            for(j = 0 ; j < enemyUnits.length ; j++) {
                enemyUnits[j] = _getComputedMob(stageInfoList[stageNo][i][j], 1);
            }
            (victory, randNonce) = _runBattle(ourUnits, enemyUnits, randNonce);
            emit RoundResult(victory, 200, 1);
            if(!victory) break;
        }  
        users[msg.sender].randNonce++;
    }

    function _getComputedStatue(uint statueNo, uint16 level, EquipInfo memory equipInfo) internal view returns(UnitInfo) {
        uint32 hp;
        uint32 atk;
        uint32 def;
        uint8 crt;
        uint8 avd;
        (hp, atk, def, crt, avd) = getStatueRawSpec(statueNo, level);
        hp += getExtraValueByEquipLevel(1, equipInfo.hpEquipLevel);
        atk += getExtraValueByEquipLevel(2, equipInfo.atkEquipLevel);
        def += getExtraValueByEquipLevel(3, equipInfo.defEquipLevel);
        return UnitInfo(hp, atk, def, crt, avd);
    }

    function _getComputedMob(uint mobNo, uint16 level) internal view returns(UnitInfo) {
        uint32 hp;
        uint32 atk;
        uint32 def;
        uint8 crt;
        uint8 avd;
        (hp, atk, def, crt, avd) = getMobRawSpec(mobNo, level);
        return UnitInfo(hp, atk, def, crt, avd);
    }

    function _runBattle(UnitInfo[] memory ourUnits, UnitInfo[] memory enemyUnits, uint nonce) internal returns(bool victory, uint lastRandNonce)
    {
        uint8 ourIdx = 0; // 석상 1개 가리키는 index
        uint8 enemyIdx = 0; // 몬스터 1개 가리키는 index
        uint damage;
        bool isCrt;
        uint8 num_attack = 0;
        uint randNonce = nonce;
        while(true)
        {
            if(_getTotalHp(ourUnits) == 0 || _getTotalHp(enemyUnits) == 0)
                break;
            ourIdx = _getNextIndex(ourIdx, ourUnits);
            enemyIdx = _getNextIndex(enemyIdx, enemyUnits);
            if(num_attack%2 == 0)
            {
                (damage, isCrt) = _attack(ourIdx, enemyIdx, 1, randNonce++, ourUnits, enemyUnits);
                emit AttackResult(true, ourIdx, enemyIdx, damage, isCrt);
                num_attack += 1;
                continue;
            }
            if(num_attack%2 == 1)
            {     
                (damage, isCrt) = _attack(ourIdx, enemyIdx, 2, randNonce++, ourUnits, enemyUnits);
                emit AttackResult(false, ourIdx, enemyIdx, damage, isCrt);               
                num_attack += 1;
                continue;
            }
        }
        if(_getTotalHp(ourUnits) == 0) //몬스터가 이긴 경우 false 반환
            return (false, randNonce);
        if(_getTotalHp(enemyUnits) == 0) //석상이 이긴 경우 true 반환
            return (true, randNonce);
    }

    function _getNextIndex(uint8 idx, UnitInfo[] memory units) internal pure returns (uint8)
    {
        uint8 u = idx;
        for(uint8 i = 1 ;i<=units.length;i++)
        {
            uint8 next = 0;
            if(u+i>=units.length) next = uint8((u+i)%units.length);
            else next = u+i;
            if(units[next].hp!=0)
            {
                u = next;
                break;
            }
        }
        return u;
    }

    function _attack
    (   
        uint8 u, uint8 m, uint8 direction, uint randNonce,
        UnitInfo[] memory units, UnitInfo[] memory mobs
    ) internal view returns (uint, bool)
    {
        uint damage = 0;
        bool isCrt = false;
        uint8 isAvd = 0;
        //direction 1 : 석고상 -> 몬스터 방향 공격
        if(direction == 1)
        {
            (damage, isCrt) = _getDamage(units[u],mobs[m], randNonce);
            isAvd = _applyDamage(mobs[m], damage, randNonce);
        }

        //direction 2 : 몬스터 -> 석고상 방향 공격
        if(direction == 2)
        {
            (damage, isCrt) = _getDamage(mobs[m],units[u], randNonce);
            isAvd = _applyDamage(units[u], damage, randNonce);
        }
        if(isAvd == 1)
            damage = 0;
        return (damage, isCrt);
        
    }

    function _getTotalHp(UnitInfo[] memory Units) internal pure returns (uint)
    {
        uint hp_units = 0;  // 석상들 총 체력
        uint8 i = 0;
        for(i = 0;i<Units.length;i++)
            hp_units += Units[i].hp;
        return (hp_units);
    }

    // 데미지 계산
    function _getDamage(UnitInfo memory from, UnitInfo memory to, uint randNonce) internal view returns(uint, bool)
    {
        bool isCrt = false; 
        uint8 randomforCritical = uint8(uint(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender, randNonce)))%100);
        uint8 crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
        {
            crk = 150;
            isCrt = true;
        }
        randomforCritical = uint8(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender,randNonce+1)))%40; //데미지 구간 설정 위한 랜덤값
        return (((from.hp*2) / to.def + 2 ) * (randomforCritical+80)/100 * crk/100, isCrt);
        //데미지 = (나의공격력 * 2  / 상대방어력  + 2 ) * (0.8~1.2 랜덤수) * (1.5강타일때)
    } 

    // 데미지 적용 함수
    function _applyDamage(UnitInfo memory to, uint damage, uint randNonce) internal view returns (uint8)
    {
        uint8 randomforAvoid = uint8(keccak256(abi.encodePacked(users[msg.sender].randNonce, msg.sender, randNonce)))%100;    //회피율 적용위한 랜덤값
        if(randomforAvoid<to.avd)   //회피 적용!
            return 1;           //데미지 미적용
        else
        {
            if(damage<=to.hp) 
                to.hp -= uint16(damage);
            else
                to.hp = 0;          //데미지 적용
            return 0;            
        }
    }
}
