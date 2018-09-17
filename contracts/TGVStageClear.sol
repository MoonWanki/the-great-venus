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
        uint[6] memory roundResult;
        (roundResult[0],roundResult[1]) = roundProgress(stagenum,1,Units);
        (roundResult[2],roundResult[3]) = roundProgress(stagenum,2,Units);
        (roundResult[4],roundResult[5]) = roundProgress(stagenum,3,Units);
        return roundResult;
    }
    function roundProgress(uint num, uint roundnum, UnitInfo[] Units) internal view returns (uint, uint)
    {
        uint stagenum = num;
        uint exp = 0;
        uint num_mobs = 0;
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
                
        }
    }

    function getMobExp(uint level) public view returns (uint)
    {
        return 300 + 100 * (level-1);
    }



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