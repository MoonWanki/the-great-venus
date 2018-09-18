pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{
    function setStageMain(uint stagenum,uint[] units) external returns(uint[7])
    {
        uint num_units = units.length;
        UnitInfo[] memory Units = new UnitInfo[](num_units);
        for(uint i = 0; i<num_units;i++)
        {
            Units[i] = setUnitData(units[i]);
        }

        uint[7] memory roundResult;     //각 라운드 승리 유무, 획득 경험치 저장 배열
        (roundResult[0],roundResult[1]) = roundProgress(stagenum,1,Units);
        if(roundResult[0]==1)           //1라운드 승리 시에만 2라운드 진행
            (roundResult[2],roundResult[3]) = roundProgress(stagenum,2,Units);
        if(roundResult[2]==1)           //2라운드 승리 시에만 2라운드 진행
            (roundResult[4],roundResult[5]) = roundProgress(stagenum,3,Units);

        renewalExpOfUser(roundResult[1]+roundResult[3]+roundResult[5]); //각 라운드 당 얻은 경험치 반영
        return roundResult;
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
    function roundProgress(uint num, uint roundnum, UnitInfo[] memory Units) internal view returns (uint, uint)
    {
        uint stagenum = num;    
        uint exp = 0;
        uint num_mobs = 0;
        bool roundwin = false;
        UnitInfo[] memory Mobs;
        if(roundnum == 1)
        {
            for(uint i = 0; i<5 ; i++)
            {
                if(stageInfoList[stagenum].round1[i] != 0 )
                    num_mobs.add(1);
            }
            Mobs = new UnitInfo[](num_mobs);
            for(uint j = 0; j<num_mobs ; j++)
            {
                Mobs[j] = mobInfoList[stageInfoList[stagenum].round1[j]];
                exp.add(getMobExp(stageInfoList[stagenum].round1[j]));
            }
            roundwin = roundBattle(Units,Mobs);
            if(roundwin)                        //1라운드 승리시
                return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
            else                                //1라운드 패배시
                return (0,0);                   //패배값 0 과 경험치 없으므로 0반환
        }
        if(roundnum == 2)
        {
            for(uint k = 0; k<5 ; k++)
            {
                if(stageInfoList[stagenum].round2[i] != 0 )
                    num_mobs.add(1);
            }
            Mobs = new UnitInfo[](num_mobs);
            for(uint l = 0; l<num_mobs ; l++)
            {
                Mobs[j] = mobInfoList[stageInfoList[stagenum].round2[j]];
                exp.add(getMobExp(stageInfoList[stagenum].round2[j]));
            }   
            roundwin = roundBattle(Units,Mobs); 
            if(roundwin)                        //2라운드 승리시
                return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
            else                                //2라운드 패배시
                return (0,0);                   //패배값 0 과 경험치 없으므로 0반환
        }
        if(roundnum == 3)
        {
            for(uint m = 0; m<5 ; m++)
            {
                if(stageInfoList[stagenum].round3[i] != 0 )
                    num_mobs.add(1);
            }
            Mobs = new UnitInfo[](num_mobs);
            for(uint n = 0; n<num_mobs ; n++)
            {
                Mobs[j] = mobInfoList[stageInfoList[stagenum].round3[j]];
                exp.add(getMobExp(stageInfoList[stagenum].round3[j]));
            }
            roundwin = roundBattle(Units,Mobs);
            if(roundwin)                        //3라운드 승리시
                return (1,exp);                 //승리값 1 과 해당 라운드 경험치반환
            else                                //3라운드 패배시
                return (0,0);                   //패배값 0 과 경험치 없으므로 0반환
        }
    }

    // 한 라운드 배틀 함수
    function roundBattle(UnitInfo[] memory units, UnitInfo[] memory mobs) internal returns(bool)
    {
        UnitInfo[] memory serialUnits = serialization(units,mobs);      // 석상과 몬스터들 번갈아가면서 채운 일렬화 과정
        return true;
    }

    // 석상들과 몬스터 일렬화
    function serialization(UnitInfo[] memory units, UnitInfo[] memory mobs) internal view returns (UnitInfo[])
    {
        uint32 n = 0;
        uint32 n1 = 0;
        uint32 n2 = 0;
        UnitInfo[] memory serialUnits = new UnitInfo[](units.length+mobs.length);
        while(true)
        {
            if(n1<units.length)
            {
                serialUnits[n] = units[n1];
                n.add(1);
                n1.add(1);
            }
            if(n2<mobs.length)
            {
                serialUnits[n] = mobs[n2];
                n.add(1);
                n2.add(1);
            }
            if(n == serialUnits.length)
                break;
        }
        return serialUnits;
    }

    // 몬스터 레벨에 따라 얻는 경험치 계산 함수 - 수정 필요
    function getMobExp(uint level) public view returns (uint)
    {
        return 300 + 100 * (level-1);
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

    //전투 방식
    //iteration 반복
    //1. 석상들과 몬스터들의 총 체력합을 계산
    //2. 총 체력합이 먼저 0이되는 쪽이 패배
    //3. 총 체력합이 두 쪽 모두 0이 아닌경우 전투 지속
    //4. 공격 주체와 공격 대상을 계산
    //5. 공격 대상에 가할 데미지 계산 - 강타율 고려
    //6. 데미지 적용 - 회피율 고려
    //7. 공격 대상 사망시 - 재배열


}