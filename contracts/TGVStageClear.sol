pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    function setStageMain(uint stagenum,uint[] units) external returns(uint[6])
    {
        uint num_units = units.length;
        UnitInfo[] memory Units = new UnitInfo[](num_units);
        for(uint i = 0; i<num_units;i++)
        {
            Units[i] = setUnitData(units[i]);
        }

        uint[6] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열

        (roundResult[0],roundResult[1]) = roundProgress(stagenum,1,Units);
        if(roundResult[0]==1)           //1라운드 승리 시에만 2라운드 진행
            (roundResult[2],roundResult[3]) = roundProgress(stagenum,2,Units);
        if(roundResult[2]==1)           //2라운드 승리 시에만 2라운드 진행
            (roundResult[4],roundResult[5]) = roundProgress(stagenum,3,Units);

        renewalExpOfUser(roundResult[1]+roundResult[3]+roundResult[5]); //각 라운드 당 얻은 경험치 반영
        return roundResult;
    }

    // 석상 기본 능력치와 장비 능력치 추가 함수
    function setUnitData(uint unit_num) public view returns(UnitInfo)
    {
        UnitInfo memory unit = statueInfoList[unit_num];
        Equip memory equip = users[msg.sender].equipList[unit_num];
        uint k = 2;
        uint level = users[msg.sender].level;
        unit.hp.add(uint32(level*3*k));
        unit.hp.add(getELevel(equip.hpEquipLevel,k));
        unit.atk.add(uint32(level*2*k));
        unit.atk.add(getELevel(equip.atkEquipLevel,k));
        unit.def.add(uint32(level*k));
        unit.def.add(getELevel(equip.defEquipLevel,k));

        return unit;
    }

    //장비 레벨 당 추가되는 능력치 계산
    function getELevel(uint level,uint k)  public pure  returns (uint32)
    {
        return uint32((level/10+1)*10+(level-1)*k);
    }

    // 스테이지 종료 이후 경험치 storage에 반영
    function renewalExpOfUser(uint exp) public returns (bool)   
    {
        if(exp<=0)
            return false;   //잘못된 Input이 들어 온 경우
        uint user_level = users[msg.sender].level;
        uint user_exp = users[msg.sender].exp;
        users[msg.sender].exp.add(exp);
        if(users[msg.sender].exp>=requiredExp[user_level])
            users[msg.sender].level.add(1);
        if(user_exp!=users[msg.sender].exp)
            return true;    // 경험치 반영이 제대로 된 경우
        else
            return false;   // 경험치 반영이 제대로 되지 않은 경우
    }

    // 한 라운드 진행 함수
    function roundProgress(uint num, uint num2, UnitInfo[] memory Units) internal view returns (uint, uint)
    {
        uint stagenum = num;   
        uint roundnum = num2;   
        uint exp = 0;
        uint num_mobs = 0;
        bool roundwin = false;
        UnitInfo[] memory Mobs;
        uint[15] memory stageInfo = stageInfoList[stagenum];
        for(uint i = (roundnum-1)*5;i<(roundnum-1)*5+5;i++)
        {
            if(stageInfo[i]!=0)         
                num_mobs.add(1);        //한 라운드에 등장하는 몬스터 수 세기
        }
        Mobs = new UnitInfo[](num_mobs);
        for(uint j = (roundnum-1)*5;j<(roundnum-1)*5+5;j++)
        {
            if(stageInfo[j]!=0) 
            {
                Mobs[j] = mobInfoList[stageInfo[j]];
                exp.add(getMobExp(stageInfo[j]));
            }
        }
        roundwin = roundBattle(Units,Mobs);
        if(roundwin)                        //1라운드 승리시
            return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
        else                                //1라운드 패배시
            return (0,0);                   //패배값 0 과 경험치 없으므로 0반환
    }

    // 몬스터 레벨에 따라 얻는 경험치 계산 함수 - 수정 필요
    function getMobExp(uint level) public pure returns (uint)
    {
        return 300 + 100 * (level-1);
    }


    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory units, UnitInfo[] memory mobs) internal returns(bool)
    {
        //UnitInfo[] memory serialUnits = serialization(units,mobs);      // 석상과 몬스터들 번갈아가면서 채운 일렬화 과정
        uint unit = 0;      // 석상 1개 가리키는 index
        uint mob = 0;       // 몬스터 1개 가리키는 index
        uint hp_units = 0;  // 석상들 총 체력
        uint hp_mobs = 0;   // 몬스터 총 체력
        while(true)
        {
            (hp_units,hp_mobs) = getSumOfHp(units,mobs);
            if(hp_units == 0 || hp_mobs == 0)
                break;
            (unit,mob) = DealExchange(unit,mob,units,mobs);
        }

        if(hp_units == 0)   //몬스터가 이긴 경우 false 반환
            return false;
        if(hp_mobs == 0)    //석상이 이긴 경우 true 반환
            return true;
    }

    // 1대1 딜 교환 함수
    function DealExchange(uint unit, uint mob,UnitInfo[] memory units, UnitInfo[] memory mobs)internal view returns (uint, uint)
    {
        uint u = unit;  //직전에 딜교환을 마친 석상 인덱스, 초기값은 0
        uint m = mob;   //직전에 딜교환을 마친 몬스터 인덱스, 초기값은 0
        
        // 다음 딜 교환 대상의 인덱스 구하기
        for(uint i = 1 ;i<=units.length;i++)
        {
            uint next = 0;
            if(u+i>=units.length) next = (u+i)%units.length;
            else next = u+i;
            if(units[next].hp!=0)
            {
                u = next;
                break;
            }
        }
        for(uint j = 1 ;j<=mobs.length;j++)
        {
            uint next2 = 0;
            if(m+j>=mobs.length) next2 = (m+j)%mobs.length;
            else next2 = m+j;
            if(mobs[next2].hp!=0)
            {
                m = next2;
                break;
            }
        }

        // 석상 -> 몬스터 공격
        uint damage = getDamage(units[u],mobs[m]);
        applyDamage(mobs[m],damage);
        if(mobs[m].hp!=0)   // 공격 당한 몬스터가 죽지 않은 경우
        {
            // 몬스터 -> 석상 공격
            damage = getDamage(mobs[m],units[u]);
            applyDamage(units[u],damage);
        }
        //딜 교환 종료한 석상과 몬스터 인덱스 반환
        return (u,m);
    }

    function getSumOfHp(UnitInfo[] memory units,UnitInfo[] memory mobs)internal view returns (uint,uint)
    {
        uint sum = 0;   //석상들 총 체력
        uint sum2 = 0;  //몬스터들 총 체력
        for(uint i = 0 ;i<units.length;i++)
        {
            sum.add(units[i].hp);
        }
        for(uint j = 0 ;j<mobs.length;j++)
        {
            sum2.add(mobs[i].hp);
        }
        return (sum,sum2);
    }

    // 데미지 계산
    function getDamage(UnitInfo from, UnitInfo to)internal view returns (uint)
    {
        uint randNance = 0;
        uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%40;                //데미지 구간 설정 위한 랜덤값
        randNance.add(1);
        uint randomforCritical = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%100;    //강타율 적용위한 랜덤값
        uint crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
            crk = 150;
        return ((from.hp*2) / to.def + 2 ) * (random+80)/100 * crk/100;
        //데미지 = (나의공격력 * 2  / 상대방어력  + 2 ) * (0.8~1.2 랜덤수) * (1.5강타일때)
    } 

    // 데미지 적용 함수
    function applyDamage(UnitInfo to, uint damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint randomforAvoid = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNance)))%100;    //회피율 적용위한 랜덤값
        if(randomforAvoid<to.avd)   //회피 적용!
            return false;           //데미지 미적용
        else
        {
            if(uint32(damage)<=to.hp) to.hp.sub(uint32(damage));
            else
                to.hp = 0;          //데미지 적용
            return true;            
        }
    }

    //전투 방식
    //iteration 반복
    //1. 석상들과 몬스터들의 총 체력합을 계산
    //2. 총 체력합이 먼저 0이되는 쪽이 패배
    //3. 총 체력합이 두 쪽 모두 0이 아닌경우 전투 지속
    //4. 공격 주체와 공격 대상을 계산
    //5. 공격 대상에 가할 데미지 계산 - 강타율 고려
    //6. 데미지 적용 - 회피율 고려
    //7. 공격 대상 사망시 - 재배열

    // // 석상들과 몬스터 일렬화
    // function serialization(UnitInfo[] memory units, UnitInfo[] memory mobs) internal view returns (UnitInfo[])
    // {
    //     uint32 n = 0;
    //     uint32 n1 = 0;
    //     uint32 n2 = 0;
    //     UnitInfo[] memory serialUnits = new UnitInfo[](units.length+mobs.length);
    //     while(true)
    //     {
    //         if(n1<units.length)
    //         {
    //             serialUnits[n] = units[n1];
    //             n.add(1);
    //             n1.add(1);
    //         }
    //         if(n2<mobs.length)
    //         {
    //             serialUnits[n] = mobs[n2];
    //             n.add(1);
    //             n2.add(1);
    //         }
    //         if(n == serialUnits.length)
    //             break;
    //     }
    //     return serialUnits;
    // }

}