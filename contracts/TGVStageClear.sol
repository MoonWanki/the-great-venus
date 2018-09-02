pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{

    function setStageMain(uint stagenum,uint roundnum) public view
    {
        //석상들 등장.
        UnitInfo[] memory Units = new UnitInfo[](users[msg.sender].numStatues);
        for(uint i = 0; i < users[msg.sender].numStatues; i++)
        {
            Units[i] = setUnitData()[i]; //장비 장착한 내 석상들..
        }

        //몬스터들 등장.
        uint numOfMob = 0; 
        UnitInfo[] memory Mobs;
        (Mobs,numOfMob) = setRound(stagenum,roundnum);

        //공격 주체 - 공격 상대 설정

        //데미지 구하기
        uint damage = getDamage(Units[1],Mobs[1]);
        //데미지 적용
        applyDamage(Units[1],Mobs[1],damage);           //회피하면 false반환 ,회피안하면 데미지 적용 true반환

    }

    // 전투 승리 유무 판정함수
    // function roundEnd(UnitInfo[] Units, UnitInfo Mobs) internal pure returns (bool) 
    // {

    // }

    //데미지 적용 함수
    function applyDamage(UnitInfo from, UnitInfo to, uint damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint randomforAvoid = uint(keccak256(now, msg.sender, randNance))%100;    //회피율 적용위한 랜덤값
        if(randomforAvoid<to.avd)   //회피 적용!
            return false;           //데미지 미적용
        else
        {
            if(uint32(damage)>=to.hp) to.hp.sub(uint32(damage));
            else
                to.hp = 0;          //데미지 적용
            return true;            
        }

    }

    //데미지 계산
    function getDamage(UnitInfo from, UnitInfo to)internal view returns (uint)
    {
        uint randNance = 0;
        uint random = uint(keccak256(now, msg.sender,randNance))%40;                //데미지 구간 설정 위한 랜덤값
        randNance++;
        uint randomforCritical = uint(keccak256(now, msg.sender,randNance))%100;    //강타율 적용위한 랜덤값
        uint crk = 100;
        if(randomforCritical<from.crt)  //강타 적용!
            crk = 150;
        return ((from.hp*2) / to.def + 2 ) * (random+80)/100 * crk/100;
        //데미지 = (나의공격력 * 2  / 상대방어력  + 2 ) * (0.8~1.2 랜덤수) * (1.5강타일때)

    } 

    //장비 정보 가져오기
    function setEquip() public view returns (Equip[])       
    {
        Equip[] memory myEquips = new Equip[](users[msg.sender].numStatues);
        for(uint i = 0; i<users[msg.sender].numStatues; i++)
        {
            myEquips[i] = users[msg.sender].equips[i];
        }
        return myEquips;
    }

    //석상 정보 가져오기
    function setUnit() public view returns(UnitInfo[])
    {
        UnitInfo[] memory myUnits = new UnitInfo[](users[msg.sender].numStatues);
        for(uint j = 0; j<users[msg.sender].numStatues; j++ )
        {
            myUnits[j] = statueInfoList[j];
        }
        return myUnits;
    }


    //Round 셋팅
    function setRound(uint stagenum,uint roundnum) public view returns(UnitInfo[] Mobs , uint32 numofmob)
    {
        uint[5] memory round;
        if(roundnum == 1)
        {
            round[0] = stageInfoList[stagenum].round1[0];
            round[1] = stageInfoList[stagenum].round1[1];
            round[2] = stageInfoList[stagenum].round1[2];
            round[3] = stageInfoList[stagenum].round1[3];
            round[4] = stageInfoList[stagenum].round1[4];
        }
        if(roundnum == 2)
        {
            round[0] = stageInfoList[stagenum].round2[0];
            round[1] = stageInfoList[stagenum].round2[1];
            round[2] = stageInfoList[stagenum].round2[2];
            round[3] = stageInfoList[stagenum].round2[3];
            round[4] = stageInfoList[stagenum].round2[4];
        }
        if(roundnum == 3)
        {
            round[0] = stageInfoList[stagenum].round3[0];
            round[1] = stageInfoList[stagenum].round3[1];
            round[2] = stageInfoList[stagenum].round3[2];
            round[3] = stageInfoList[stagenum].round3[3];
            round[4] = stageInfoList[stagenum].round3[4];
        }

        //해당 라운드에 필요한 몬스터 수 구하기
        uint32 NumOfMob = 0;
        for(uint j = 0 ; j<5 ; j++)
        {
            if(round[j]!=0)
                NumOfMob.add(1);
        }

        UnitInfo[] memory roundMob = new UnitInfo[](NumOfMob);
        for(uint i = 0; i<NumOfMob; i++)
        {
            roundMob[i].hp = mobInfoList[round[i]].hp;
            roundMob[i].atk = mobInfoList[round[i]].atk;
            roundMob[i].def = mobInfoList[round[i]].def;
            roundMob[i].crt = mobInfoList[round[i]].crt;
            roundMob[i].avd = mobInfoList[round[i]].avd;
        }
        return (roundMob,NumOfMob);
    }


    //석상 능력치 계산
    function setUnitData() public view  returns(UnitInfo[])
    {
        UnitInfo[] memory Units = setUnit();
        Equip[] memory Equips = setEquip();

        uint k = 2;                                                 //능력치 계산 계수
        uint mylevel = users[msg.sender].level;                     //현재 유저 레벨

        //석상 능력치 계산
        for(uint m = 0; m<users[msg.sender].numStatues; m++ )
        {
            Units[m].hp.add(uint32(mylevel*3*k));                    // 레벨 업 추가 체력
            Units[m].hp.add(getELevel(Equips[m].hpEquipLevel,k));    // 장비 업 추가 체력

            Units[m].atk.add(uint32(mylevel*2*k));                    // 레벨 업 추가 공격력
            Units[m].atk.add(getELevel(Equips[m].atkEquipLevel,k));   // 장비 업 추가 공격력

            Units[m].def.add(uint32(mylevel*k));                      // 레벨 업 추가 방어력
            Units[m].def.add(getELevel(Equips[m].defEquipLevel,k));   // 장비 업 추가 방어력
        }
        return Units;
    }

    //장비 레벨 당 추가되는 능력치 계산
    function getELevel(uint level,uint k)  public pure  returns (uint32)
    {
        return uint32((level/10+1)*10+(level-1)*k);
    }

}