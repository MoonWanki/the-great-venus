pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    using SafeMath for uint256;

    function setStageMain(uint8 stagenum,uint8[] units) external returns(uint[6],uint[300])
    {
        UnitInfo[] memory Units = new UnitInfo[](units.length);
        uint8 i = 0;
        for(i = 0; i<units.length;i++)
            Units[i] = setUnitData(units[i]);

        uint[6] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열
        uint exp = 0;
        uint[300] memory all_data;
        uint[100] memory datas;
        
        //1라운드 진행
        (roundResult[0],roundResult[1],datas) = roundProgress(stagenum,1,Units);
        exp += roundResult[1];
        for(i = 0; i<100;i++)
            all_data[i] = datas[i];
        //이전 라운드 승리시 2라운드 진행
        if(roundResult[0]==1)    
        {
            for(i = 0; i<units.length;i++)
                Units[i] = setUnitData(units[i]);
            (roundResult[2],roundResult[3],datas) = roundProgress(stagenum,2,Units);
            exp += roundResult[3];
            for(i = 0; i<100;i++)
                all_data[i+100] = datas[i];
        }      

        //이전 라운드 승리시 3라운드 진행
        if(roundResult[2]==1)      
        {
            for(i = 0; i<units.length;i++)
                Units[i] = setUnitData(units[i]);
            (roundResult[4],roundResult[5],datas) = roundProgress(stagenum,3,Units);
            exp += roundResult[5];
            for(i = 0; i<100;i++)
                all_data[i+200] = datas[i];
        }   
        // 라운드 별 얻은 경험치 획득  
        users[msg.sender].exp += exp;
        users[msg.sender].gold += exp;

        // 누적 경험치 상승으로 레벨 업
        if(users[msg.sender].exp>requiredExp[users[msg.sender].level+1])
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

        return (roundResult,all_data);
    }

    // 석상 기본 능력치와 장비 능력치 추가 함수
    function setUnitData(uint8 unit_num) public view returns(UnitInfo)
    {
        UnitInfo memory unit = statueInfoList[unit_num];
        Equip memory equip = equipList[msg.sender][unit_num];
        uint8 k = 2;
        uint level = users[msg.sender].level;
        unit.hp += uint16(level*3*k);
        unit.hp += (getELevel(equip.hpEquipLevel,k));
        unit.atk += (uint16(level*2*k));
        unit.atk += (getELevel(equip.atkEquipLevel,k));
        unit.def += (uint16(level*k));
        unit.def += (getELevel(equip.defEquipLevel,k));

        return unit;
    }

    //장비 레벨 당 추가되는 능력치 계산
    function getELevel(uint level,uint8 k)  public pure  returns (uint16)
    {
        return uint16((level/10+1)*10+(level-1)*k);
    }

    // 한 라운드 진행 함수
    function roundProgress(uint8 stagenum, uint8 roundnum, UnitInfo[] memory Units) internal view returns (uint, uint ,uint[100])
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
        uint[100] memory dealDatas;
        (roundwin,dealDatas) = roundBattle(Units,Mobs);
        if(roundwin)                        //1라운드 승리시
        {
            return (1,exp,dealDatas);                 //승리값 1 과 해당 라운드 경험치반환
        }                                      
        else                                //1라운드 패배시
            return (2,0,dealDatas);                   //패배값 0 과 경험치 없으므로 0반환
    }

    // 몬스터 레벨에 따라 얻는 경험치 계산 함수 - 수정 필요
    function getMobExp(uint level) public returns (uint)
    {
        return 300 + 100 * (level-1);
    }

    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory Units, UnitInfo[] memory Mobs) internal returns(bool, uint[100])
    {
        uint8 unit = 0;      // 석상 1개 가리키는 index
        uint8 mob = 0;       // 몬스터 1개 가리키는 index
        uint[100] memory dealDatas;
        uint8 num_data = 0;
        while(true)
        {
            if(getSumOfHp(Units) == 0 || getSumOfHp(Mobs) == 0)
                break;
            unit = getNextIndex(unit, Units);
            mob = getNextIndex(mob, Mobs);
            if(num_data%2 == 0)
            {
                dealDatas[num_data*4] = 111;
                dealDatas[num_data*4+1] = unit;                    
                dealDatas[num_data*4+2] = mob;
                dealDatas[num_data*4+3] = attack(unit, mob, 1, Units, Mobs);
                num_data += 1;
                continue;
            }
            if(num_data%2 == 1)
            {                    
                dealDatas[num_data*4] = 222;
                dealDatas[num_data*4+1] = mob;
                dealDatas[num_data*4+2] = unit;
                dealDatas[num_data*4+3] = attack(unit, mob, 2, Units, Mobs);
                num_data += 1;
                continue;
            }
                //(unit,mob,dealData) = DealExchange(unit,mob,Units,Mobs);
        }

        if(getSumOfHp(Units) == 0)   //몬스터가 이긴 경우 false 반환
            return (false,dealDatas);
        if(getSumOfHp(Mobs) == 0)    //석상이 이긴 경우 true 반환
            return (true,dealDatas);
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

    function attack(uint8 u, uint8 m, uint8 direction, UnitInfo[] memory units, UnitInfo[] memory mobs) internal returns (uint)
    {
        uint16 damage = 0;
        if(direction == 1)
        {
            damage = uint16(getDamage(units[u],mobs[m]));
            applyDamage(mobs[m],uint16(damage));
        }
        if(direction == 2)
        {
            damage = uint16(getDamage(mobs[m],units[u]));
            applyDamage(units[u],uint16(damage));
        }
        return damage;
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
    function getDamage(UnitInfo from, UnitInfo to)internal view returns (uint)
    {
        uint randNance = 0;
        uint8 random = uint8(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%40;                //데미지 구간 설정 위한 랜덤값
        randNance.add(1);
        uint8 randomforCritical = uint8(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%100;    //강타율 적용위한 랜덤값
        uint8 crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
            crk = 150;
        return ((from.hp*2) / to.def + 2 ) * (random+80)/100 * crk/100;
        //데미지 = (나의공격력 * 2  / 상대방어력  + 2 ) * (0.8~1.2 랜덤수) * (1.5강타일때)
    } 

    // 데미지 적용 함수
    function applyDamage(UnitInfo memory to, uint16 damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint8 randomforAvoid = uint8(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNance)))%100;    //회피율 적용위한 랜덤값
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
