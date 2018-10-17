pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    using SafeMath for uint256;

    event attackResult(uint way, uint unit, uint mob, uint damamge, uint isCrk);

    function setStageMain(uint8 stagenum,uint8[] units) external returns(uint[6])
    {
        if(users[msg.sender].randnance == 65535)
            users[msg.sender].randnance = 0;
        else
            users[msg.sender].randnance += 1;
            
        UnitInfo[] memory Units = new UnitInfo[](units.length);
        uint8 i = 0;
        for(i = 0; i<units.length;i++)
            Units[i] = setUnitData(units[i]);

        uint[6] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열
        uint exp = 0;
        
        //1라운드 진행
        (roundResult[0],roundResult[1]) = roundProgress(stagenum,1,Units);
        exp += roundResult[1];

        //이전 라운드 승리시 2라운드 진행
        if(roundResult[0]==1)    
        {
            for(i = 0; i<units.length;i++)
                Units[i] = setUnitData(units[i]);
            (roundResult[2],roundResult[3]) = roundProgress(stagenum,2,Units);
            exp += roundResult[3];
        }      

        //이전 라운드 승리시 3라운드 진행
        if(roundResult[2]==1)      
        {
            for(i = 0; i<units.length;i++)
                Units[i] = setUnitData(units[i]);
            (roundResult[4],roundResult[5]) = roundProgress(stagenum,3,Units);
            exp += roundResult[5];
        }   
        // 라운드 별 얻은 경험치 획득  
        users[msg.sender].exp += exp;
        users[msg.sender].gold += exp;

        // 누적 경험치 상승으로 레벨 업
        if(getRequiredExp(users[msg.sender].level)<users[msg.sender].exp)
            users[msg.sender].level += 1;

        // 클리어 스테이지 +1
        if(roundResult[4]==1)
        {
            if(users[msg.sender].lastStage<stagenum) //처음 스테이지 클리어 할 때
            {
                users[msg.sender].lastStage += 1;
                if(users[msg.sender].lastStage == 1 || users[msg.sender].lastStage == 10 || users[msg.sender].lastStage == 25 ||
                   users[msg.sender].lastStage == 40 || users[msg.sender].lastStage == 55 || users[msg.sender].lastStage == 70 ||
                   users[msg.sender].lastStage == 85 || users[msg.sender].lastStage == 100 || users[msg.sender].lastStage == 120)
                   users[msg.sender].numStatues += 1;
            }         
        }

        return (roundResult);
    }



    // 석상 기본 능력치와 장비 능력치 추가 함수
    function setUnitData(uint8 unit_num) public returns(UnitInfo)
    {
        UnitInfo memory unit = statueInfoList[unit_num];
        Equip memory equip = equipList[msg.sender][unit_num];
        uint level = users[msg.sender].level;
        unit.hp += uint16(level*3*2);
        unit.hp += getAddEquipValue(equip.hpEquipLevel, 1);
        unit.atk += (uint16(level*2*2));
        unit.atk += getAddEquipValue(equip.atkEquipLevel, 2);
        unit.def += (uint16(level*2));
        unit.def += getAddEquipValue(equip.defEquipLevel, 3);
        return unit;
    }



    // 한 라운드 진행 함수
    function roundProgress(uint8 stagenum, uint8 roundnum, UnitInfo[] memory Units) internal view returns (uint, uint)
    {    
        uint exp = 0;
        uint8 num_mobs = 0;
        bool roundwin = false;
        UnitInfo[] memory Mobs;
        uint8[15] memory stageInfo = stageInfoList[stagenum];
        uint8 i = 0;
        for(i = (roundnum-1)*5;i<(roundnum-1)*5+5;i++)
        {
            if(stageInfo[i]==0)  
            {
                num_mobs = uint8(i - (roundnum-1)*5);
                break;
            }       
        }
        
        Mobs = new UnitInfo[](num_mobs);
        for(i = 0;i<num_mobs;i++)
        {
            uint8 mob_num = stageInfo[i+(roundnum-1)*5];
            Mobs[i] = mobInfoList[mob_num];
            exp += getMobExp(mob_num);
        }
        (roundwin) = roundBattle(Units,Mobs);
        if(roundwin)                        //1라운드 승리시
        {
            return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
        }                                      
        else                                //1라운드 패배시
            return (2,0);                   //패배값 0 과 경험치 없으므로 0반환
    }

    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory Units, UnitInfo[] memory Mobs) internal returns(bool)
    {
        uint8 unit = 0;      // 석상 1개 가리키는 index
        uint8 mob = 0;       // 몬스터 1개 가리키는 index

        uint damage;
        uint isCrk;
        uint8 num_data = 0;
        while(true)
        {
            if(getSumOfHp(Units) == 0 || getSumOfHp(Mobs) == 0)
                break;
            unit = getNextIndex(unit, Units);
            mob = getNextIndex(mob, Mobs);
            if(num_data%2 == 0)
            {
                (damage, isCrk) = attack(unit, mob, 1, Units, Mobs);
                emit attackResult(1, unit, mob, damage, isCrk);
                num_data += 1;
                continue;
            }
            if(num_data%2 == 1)
            {                    
                (damage, isCrk) = attack(unit, mob, 2, Units, Mobs);
                emit attackResult(2, unit, mob, damage, isCrk);
                num_data += 1;
                continue;
            }
        }

        if(getSumOfHp(Units) == 0)   //몬스터가 이긴 경우 false 반환
            return (false);
        if(getSumOfHp(Mobs) == 0)    //석상이 이긴 경우 true 반환
            return (true);
    }

    function getNextIndex(uint8 index, UnitInfo[] memory units) internal returns (uint8)
    {
        uint8 u = index;
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

    function attack(uint8 u, uint8 m, uint8 direction, UnitInfo[] memory units, UnitInfo[] memory mobs) internal returns (uint, uint)
    {
        uint damage = 0;
        uint isCrk = 0;

        //direction 1 : 석고상 -> 몬스터 방향 공격
        if(direction == 1)
        {
            (damage, isCrk) = getDamage(units[u],mobs[m]);
            applyDamage(mobs[m],uint16(damage));
        }
        //direction 2 : 몬스터 -> 석고상 방향 공격
        if(direction == 2)
        {
            (damage, isCrk) = getDamage(mobs[m],units[u]);
            applyDamage(units[u],uint16(damage));
        }
        return (damage,isCrk);
    }

    function getSumOfHp(UnitInfo[] memory Units) internal returns (uint)
    {
        uint hp_units = 0;  // 석상들 총 체력
        uint8 i = 0;
        for(i = 0;i<Units.length;i++)
            hp_units += Units[i].hp;
        return (hp_units);
    }

    // 데미지 계산
    function getDamage(UnitInfo memory from, UnitInfo memory to)internal view returns (uint, uint)
    {
        uint randNance = 0;
        uint isCrk = 0;
        uint8 random = uint8(keccak256(abi.encodePacked(users[msg.sender].randnance, msg.sender,randNance)))%40;  //데미지 구간 설정 위한 랜덤값
        randNance.add(1);
        uint8 randomforCritical = uint8(keccak256(abi.encodePacked(users[msg.sender].randnance, msg.sender,randNance)))%100;    //강타율 적용위한 랜덤값
        uint8 crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
        {
            crk = 150;
            isCrk = 1;
        }
            
        return (((from.hp*2) / to.def + 2 ) * (random+80)/100 * crk/100,isCrk);
        //데미지 = (나의공격력 * 2  / 상대방어력  + 2 ) * (0.8~1.2 랜덤수) * (1.5강타일때)
    } 

    // 데미지 적용 함수
    function applyDamage(UnitInfo memory to, uint16 damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint8 randomforAvoid = uint8(keccak256(abi.encodePacked(users[msg.sender].randnance, msg.sender, randNance)))%100;    //회피율 적용위한 랜덤값
        if(randomforAvoid<to.avd)   //회피 적용!
            return false;           //데미지 미적용
        else
        {
            if(damage<=to.hp) 
                to.hp -= damage;
            else
                to.hp = 0;          //데미지 적용
            return true;            
        }
    }
}
