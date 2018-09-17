pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop 
{

    function setStageMain(uint stagenum) external returns(uint)
    {
        //석상들 등장.
        UnitInfo[] memory Units = new UnitInfo[](users[msg.sender].numStatues);
        for(uint i = 0; i < users[msg.sender].numStatues; i++)
        {
            Units[i] = setUnitData()[i];            //석상들 레벨당 기본 능력치 + 장비 추가 능력치 부여
        }

        //몬스터들 등장.
        uint32 numOfMob = 0; 
        UnitInfo[] memory Mobs;
        (Mobs,numOfMob) = setRound(stagenum);        //라운드에 등장할 몬스터 능력치부여

        //석상들과 몬스터들 일렬화
        (UnitInfo[] memory roundOnUnits,bool[] memory boolarrayUnits) = Serialization(Units, Mobs, numOfMob);

        while(true)
        {
            (uint sumOfUnithp,uint sumOfMobhp) = getSumOfHp(Units, Mobs, numOfMob);
            (bool endofbattle,uint winner) = Endofbattle(sumOfUnithp,sumOfMobhp);
            if(endofbattle)
                break;
            (uint from, uint to) = getAttacker(roundOnUnits);                   //공격 주체, 공격 대상 정하기
            uint damage = getDamage(roundOnUnits[from],roundOnUnits[to]);       //데미지 구하기
            applyDamage(roundOnUnits[to],damage);                                //데미지 적용 - 회피 했으면 false 반환.

        }
        return winner;
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
    function getSumOfHp(UnitInfo[] Units,UnitInfo[] Mobs,uint numOfMob)  internal view returns(uint , uint)
    {
        uint sumOfUnithp = 0;   //석상 총 체력
        uint sumOfMobhp = 0;    //몬스터 총 체력
        for(uint i = 0; i < users[msg.sender].numStatues; i++)
        {
            sumOfUnithp = Units[i].hp; //장비 장착한 내 석상들..
        }
        for(uint j = 0; j < numOfMob; j++)
        {
            sumOfMobhp = Mobs[i].hp; //장비 장착한 내 석상들..
        }
        return (sumOfUnithp,sumOfMobhp);
    }
    function getAttacker(UnitInfo[] roundOnUnits) internal view returns(uint , uint)
    {
        return (0,0);
        
    }

    //석상과 몬스터들 일렬화
    function Serialization(UnitInfo[] Units,UnitInfo[] Mobs,uint numOfMob ) internal view returns(UnitInfo[],bool[])
    {
        uint32 serialnum = 0;
        uint32 stackonunit = 0;
        uint32 stackonmob = 0;
        UnitInfo[] memory roundOnUnits = new UnitInfo[](users[msg.sender].numStatues+numOfMob);
        bool[] memory boolarrayUnits = new bool[](roundOnUnits.length);
        while(true)
        {
            if(stackonunit < users[msg.sender].numStatues)
            {
                boolarrayUnits[serialnum] = true;                       //석상이면 true
                roundOnUnits[serialnum] = Units[stackonunit];
                serialnum++;    
                stackonunit++;
            }
            if(stackonmob < numOfMob)
            {
                boolarrayUnits[serialnum] = false;                      //몬스터이면 false
                roundOnUnits[serialnum] = Mobs[stackonmob];
                serialnum++;    
                stackonmob++;
            }
            if(serialnum == users[msg.sender].numStatues+numOfMob)
                break;
        }
        return (roundOnUnits,boolarrayUnits);
    }

    //전투 종료 판정 함수
    function Endofbattle(uint sumOfUnithp, uint sumOfMobhp)internal view returns (bool endofbattle, uint winner)
    {
        if(sumOfUnithp == 0 )
            return (true, 1);   // winner 가 1인 경우 유저 승리
        if(sumOfMobhp == 0)
            return (true, 2);  // winner 가 2인 경우 몬스터 승리
        if(sumOfUnithp != 0 && sumOfMobhp != 0)
            return (false, 0);  // 전투 지속
    }

    //데미지 적용 함수
    function applyDamage(UnitInfo to, uint damage)internal view returns (bool)
    {
        uint randNance = 0;
        uint randomforAvoid = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNance)))%100;    //회피율 적용위한 랜덤값
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
        uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%40;                //데미지 구간 설정 위한 랜덤값
        randNance++;
        uint randomforCritical = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNance)))%100;    //강타율 적용위한 랜덤값
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
            myEquips[i] = users[msg.sender].equipList[i];
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
    function setRound(uint stagenum) public view returns(UnitInfo[] Mobs , uint32 numofmob)
    {
        uint[5] memory round;

        round[0] = stageInfoList[stagenum].round1[0];
        round[1] = stageInfoList[stagenum].round1[1];
        round[2] = stageInfoList[stagenum].round1[2];
        round[3] = stageInfoList[stagenum].round1[3];
        round[4] = stageInfoList[stagenum].round1[4];

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