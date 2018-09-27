pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    using SafeMath for uint256;

    function setStageMain(uint stagenum,uint[] units) external returns(uint[6])
    {
        uint num_units = units.length;
        uint stage = stagenum;
        UnitInfo[] memory Units = new UnitInfo[](num_units);
        for(uint i = 0; i<num_units;i++)
        {
            Units[i] = setUnitData(units[i]);
        }

        uint[6] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열
        uint exp = 0;
        (roundResult[0],roundResult[1]) = roundProgress(stage,1,Units);
        exp += roundResult[1];
        if(roundResult[0]==1)    
        {
            for(uint j = 0; j<num_units;j++)
                Units[j] = setUnitData(units[j]);
            (roundResult[2],roundResult[3]) = roundProgress(stage,2,Units);
            exp += roundResult[3];
             //1라운드 승리 시에만 2라운드 진행
        }      
            
        if(roundResult[2]==1)      
        {
            for(uint m = 0; m<num_units;m++)
                Units[m] = setUnitData(units[m]);
            //2라운드 승리 시에만 2라운드 진행
            (roundResult[4],roundResult[5]) = roundProgress(stage,3,Units);
            exp += roundResult[5];
        }     
        users[msg.sender].exp += exp;
        if(users[msg.sender].exp>=requiredExp[users[msg.sender].level])
            users[msg.sender].level += 1;
        if(roundResult[5]>0)
            users[msg.sender].lastStage += 1;
        return roundResult;
    }

    // 석상 기본 능력치와 장비 능력치 추가 함수
    function setUnitData(uint unit_num) public view returns(UnitInfo)
    {
        UnitInfo memory unit = statueInfoList[unit_num];
        Equip memory equip = equipList[msg.sender][unit_num];
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
            if(stageInfo[i]==0)  
            {
                num_mobs = i - (roundnum-1)*5;
                break;
            }       
        }
        
        Mobs = new UnitInfo[](num_mobs);
        for(uint j = 0;j<num_mobs;j++)
        {
            Mobs[j] = mobInfoList[stageInfo[j+(roundnum-1)*5]];
            exp += getMobExp(stageInfo[j+(roundnum-1)*5]);
        }
        roundwin = roundBattle(Units,Mobs);
        if(roundwin)                        //1라운드 승리시
            return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
        else                                //1라운드 패배시
            return (2,0);                   //패배값 0 과 경험치 없으므로 0반환
    }

    // 몬스터 레벨에 따라 얻는 경험치 계산 함수 - 수정 필요
    function getMobExp(uint level) public pure returns (uint)
    {
        return 300 + 100 * (level-1);
    }

    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory Units, UnitInfo[] memory Mobs) internal returns(bool)
    {
        uint unit = 0;      // 석상 1개 가리키는 index
        uint mob = 0;       // 몬스터 1개 가리키는 index
        uint hp_units = 0;  // 석상들 총 체력
        uint hp_mobs = 0;   // 몬스터 총 체력
//        (unit,mob) = DealExchange(unit,mob,Units,Mobs);
//        (users[msg.sender].gold,users[msg.sender].exp) = getSumOfHp(Units,Mobs);
        while(true)
        {
            (hp_units,hp_mobs) = getSumOfHp(Units,Mobs);
            if(hp_units == 0 || hp_mobs == 0)
                break;
            else
            {
                (unit,mob) = DealExchange(unit,mob,Units,Mobs);
            }
        }

        if(hp_units == 0)   //몬스터가 이긴 경우 false 반환
            return false;
        if(hp_mobs == 0)    //석상이 이긴 경우 true 반환
            return true;
    }

    // 1대1 딜 교환 함수
    function DealExchange(uint unit, uint mob,UnitInfo[] memory units, UnitInfo[] memory mobs) internal returns (uint, uint)
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
        applyDamage(mobs[m],uint32(damage));
        if(mobs[m].hp!=0)   // 공격 당한 몬스터가 죽지 않은 경우
        {
            // 몬스터 -> 석상 공격
            damage = getDamage(mobs[m],units[u]);
            applyDamage(units[u],uint32(damage));
        }
        //딜 교환 종료한 석상과 몬스터 인덱스 반환
        return (u,m);
    }

    function getSumOfHp(UnitInfo[] memory Units, UnitInfo[] memory Mobs) internal returns (uint,uint)
    {
        uint hp_units = 0;  // 석상들 총 체력
        uint hp_mobs = 0;   // 몬스터 총 체력
        for(uint i = 0;i<Units.length;i++)
            hp_units += Units[i].hp;
        for(uint j = 0;j<Mobs.length;j++)
            hp_mobs += Mobs[j].hp;
        return (hp_units,hp_mobs);
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
    function applyDamage(UnitInfo memory to, uint32 damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint randomforAvoid = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNance)))%100;    //회피율 적용위한 랜덤값
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