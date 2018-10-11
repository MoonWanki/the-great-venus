pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    using SafeMath for uint256;

    function setStageFirst(uint8[] units) public returns(RoundResult)
    {
        createUser(users[msg.sender].name);
        RoundResult memory r1 = setStageMain(1,units);
        return r1;
    }

    // 신규 유저 생성.
    function createUser(string _name) public returns (string) {
        users[msg.sender] = User(_name, 0, 0, 0, 1, 0, 1, 0);
        if(users[msg.sender].level == 0)
        {   
            numUsers.add(1);
        }
        return (
            users[msg.sender].name
        );
    }

    function setStageMain(uint8 stagenum,uint8[] units) public returns(RoundResult)
    {

        RoundResult memory r1;

        if(users[msg.sender].randnance>256)
            users[msg.sender].randnance %= uint8(256);
        users[msg.sender].randnance += 1;
        uint8 num_units = uint8(units.length);
        uint8 stage = stagenum;
        UnitInfo[] memory Units = new UnitInfo[](num_units);
        for(uint8 i = 0; i<num_units;i++)
        {
            Units[i] = getUnitLevelData(units[i], 2);
            uint16[3] memory temp = getUnitEquipData(units[i], 2);
            Units[i].hp += temp[0];
            Units[i].atk += temp[1];
            Units[i].def += temp[0];
        }

        //uint[6] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열
        //uint exp = 0;

        //1라운드 진행
        uint a;
        (a, r1) = roundProgress(stage,1,Units,r1);
        // exp += roundResult[1];


        // //이전 라운드 승리시 2라운드 진행
        // if(roundResult[0]==1)    
        // {
        //     for(uint8 j = 0; j<num_units;j++)
        //     {
        //         Units[j] = getUnitLevelData(units[j], 2);
        //         uint16[3] memory temp2 = getUnitEquipData(units[j], 2);
        //         Units[j].hp += temp2[0];
        //         Units[j].atk += temp2[1];
        //         Units[j].def += temp2[0];
        //     }
        //     (roundResult[2],roundResult[3]) = roundProgress(stage,2,Units);
        //     exp += roundResult[3];
        // }      

        // //이전 라운드 승리시 3라운드 진행
        // if(roundResult[2]==1)      
        // {
        //     for(uint8 m = 0; m<num_units;m++)
        //     {
        //         Units[m] = getUnitLevelData(units[m], 2);
        //         uint16[3] memory temp3 = getUnitEquipData(units[m], 2);
        //         Units[m].hp += temp3[0];
        //         Units[m].atk += temp3[1];
        //         Units[m].def += temp3[0];
        //     }
        //     (roundResult[4],roundResult[5]) = roundProgress(stage,3,Units);
        //     exp += roundResult[5];
        // }   
        // // 라운드 별 얻은 경험치 획득  
        // users[msg.sender].exp += exp;
        // users[msg.sender].gold += exp;

        // // 누적 경험치 상승으로 레벨 업
        // if(users[msg.sender].exp>requiredExp[users[msg.sender].level+1])
        //     users[msg.sender].level += 1;

        // // 클리어 스테이지 +1
        // if(roundResult[4]==1)
        // {
        //     if(users[msg.sender].lastStage<stagenum) //처음 스테이지 클리어 할 때
        //     {
        //         users[msg.sender].lastStage += 1;
        //         if(users[msg.sender].lastStage == 1 || users[msg.sender].lastStage == 10 || users[msg.sender].lastStage == 25 ||
        //            users[msg.sender].lastStage == 40 || users[msg.sender].lastStage == 55 || users[msg.sender].lastStage == 70 ||
        //            users[msg.sender].lastStage == 85 || users[msg.sender].lastStage == 100 || users[msg.sender].lastStage == 120)
        //            users[msg.sender].numStatues += 1;
        //     }         
        // }

        return r1;
    }

    function getUnitLevelData(uint8 unit_num, uint8 k) public view returns (UnitInfo)
    {
        UnitInfo memory unit = statueInfoList[unit_num];
        uint level = users[msg.sender].level;
        unit.hp += uint16(level*3*k);
        unit.atk += (uint16(level*2*k));
        unit.def += (uint16(level*k));
        return unit;
    }


    //장비 미착용 석고상 데이터 반환 함수
    function getUnitEquipData(uint8 unit_num, uint8 k) public view returns (uint16[3])
    {
        uint16[3] memory addedequipdata;
        Equip memory equip = equipList[msg.sender][unit_num];
        addedequipdata[0] = getELevel(equip.hpEquipLevel,k);
        addedequipdata[1] = getELevel(equip.atkEquipLevel,k);
        addedequipdata[2] = getELevel(equip.defEquipLevel,k);
        return addedequipdata;
    }

    //장비 레벨 당 추가되는 능력치 계산
    function getELevel(uint level,uint8 k)  public pure  returns (uint16)
    {
        return uint16((level/10+1)*10+(level-1)*k);
    }

    // 한 라운드 진행 함수
    function roundProgress(uint8 stagenum, uint8 num2, UnitInfo[] memory Units,RoundResult memory r1) internal view returns (uint,RoundResult)
    {
        //uint8 stagenum = num;   
        uint8 roundnum = num2;   
        //uint exp = 0;
        uint8 num_mobs = 0;
        bool roundwin = false;
        UnitInfo[] memory Mobs;
        uint8[15] memory stageInfo = stageInfoList[stagenum];
        RoundResult memory r = r1;

        for(uint8 i = (roundnum-1)*5;i<(roundnum-1)*5+5;i++)
        {
            if(stageInfo[i]==0)  
            {
                num_mobs = uint8(i - (roundnum-1)*5);
                break;
            }       
        }
        
        Mobs = new UnitInfo[](num_mobs);
        for(uint8 j = 0;j<num_mobs;j++)
        {
            Mobs[j] = mobInfoList[stageInfo[j+(roundnum-1)*5]];
            //exp += getMobExp(stageInfo[j+(roundnum-1)*5]);
        }
        (roundwin,r) = roundBattle(Units,Mobs,r);
        if(roundwin)                        //1라운드 승리시
        {
            return (1,r);                 //승리값 1 과 해당 라운드 경험치반환
        }                                      
        else                                //1라운드 패배시
            return (2,r);                   //패배값 0 과 경험치 없으므로 0반환
    }

    // 몬스터 레벨에 따라 얻는 경험치 계산 함수 - 수정 필요
    function getMobExp(uint level) public pure returns (uint)
    {
        return 300 + 100 * (level-1);
    }

    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory Units, UnitInfo[] memory Mobs,RoundResult memory r1) internal returns(bool,RoundResult)
    {
        uint8 unit = 0;      // 석상 1개 가리키는 index
        uint8 mob = 0;       // 몬스터 1개 가리키는 index
        uint hp_units = 0;  // 석상들 총 체력
        uint hp_mobs = 0;   // 몬스터 총 체력
        while(true)
        {
            (hp_units,hp_mobs) = getSumOfHp(Units,Mobs);
            if(hp_units == 0 || hp_mobs == 0)
                break;
            else
            {
                (unit,mob,r1) = DealExchange(unit,mob,Units,Mobs,r1);
            }
        }

        if(hp_units == 0)   //몬스터가 이긴 경우 false 반환
            return (false,r1);
        if(hp_mobs == 0)    //석상이 이긴 경우 true 반환
            return (true,r1);
    }

    function getNextIndex(UnitInfo[] memory units, uint8 idx) internal pure returns (uint8)
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
    // 1대1 딜 교환 함수
    function DealExchange
    (
        uint8 unit,
        uint8 mob,
        UnitInfo[] memory units,
        UnitInfo[] memory mobs,
        RoundResult memory r1
    ) internal view returns (uint8, uint8,RoundResult)
    {
        uint8 u = unit;  //직전에 딜교환을 마친 석상 인덱스, 초기값은 0
        uint8 m = mob;   //직전에 딜교환을 마친 몬스터 인덱스, 초기값은 0
        RoundResult memory r = r1;
        uint8 num_ = 0;
        // 다음 딜 교환 대상의 인덱스 구하기
        u = getNextIndex(units, u);
        m = getNextIndex(mobs, m);

        // uint8[] memory attacker;
        // uint8[] memory mattchar;
        // uint[] memory damage;
        // bool[] memory isCrk;
        // 석상 -> 몬스터 공격
        uint damage;
        (damage,r.isCrk[num_]) = getDamage(units[u],mobs[m]);
        applyDamage(mobs[m],uint16(damage));
        r.attacker[num_] = u;
        r.mattchar[num_] = m;
        r.damage[num_] = damage;
        num_ += 1; 
        if(mobs[m].hp!=0)   // 공격 당한 몬스터가 죽지 않은 경우
        {
            // 몬스터 -> 석상 공격
            (damage,r.isCrk[num_]) = getDamage(mobs[m],units[u]);
            applyDamage(units[u],uint16(damage));
            r.attacker[num_] = m;
            r.mattchar[num_] = u;
            r.damage[num_] = damage;
            num_ += 1; 
        }
        //딜 교환 종료한 석상과 몬스터 인덱스 반환
        return (u,m,r);
    }

    function getSumOfHp(UnitInfo[] memory Units, UnitInfo[] memory Mobs) internal pure returns (uint,uint)
    {
        uint hp_units = 0;  // 석상들 총 체력
        uint hp_mobs = 0;   // 몬스터 총 체력
        for(uint8 i = 0;i<Units.length;i++)
            hp_units += Units[i].hp;
        for(uint8 j = 0;j<Mobs.length;j++)
            hp_mobs += Mobs[j].hp;
        return (hp_units,hp_mobs);
    }


    // 데미지 계산
    function getDamage(UnitInfo memory from, UnitInfo memory to)internal view returns (uint,bool)
    {
        bool isCrk = false;
        uint randNance = 0;
        uint8 random = uint8(keccak256(abi.encodePacked(users[msg.sender].randnance,msg.sender,randNance)))%40;                //데미지 구간 설정 위한 랜덤값
        randNance.add(1);
        uint8 randomforCritical = uint8(keccak256(abi.encodePacked(users[msg.sender].randnance, msg.sender,randNance)))%100;    //강타율 적용위한 랜덤값
        uint8 crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
        {
            crk = 150;
            isCrk = true;
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