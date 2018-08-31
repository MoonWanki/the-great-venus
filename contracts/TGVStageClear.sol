pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVItemShop.sol";

contract TGVStageClear is TGVItemShop {

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

    //스테이지 정보 가져오기
    function setStage(uint stagenum) public view returns(StageInfo)
    {
        StageInfo memory myStage = stageInfoList[stagenum];
        return myStage;
    }

    //몬스터 능력치 셋팅
    function setMobData(uint stagenum) public view
    {
        StageInfo memory Stage = setStage(stagenum);
        UnitInfo[] memory round1 = new UnitInfo[](5);
        UnitInfo[] memory round2 = new UnitInfo[](5);
        UnitInfo[] memory round3 = new UnitInfo[](5);
        for(uint i = 0; i<5; i++)
        {
            round1[i].hp = uint32(Stage.round1[0]);
            round1[i].atk = uint32(Stage.round1[1]);
            round1[i].def = uint32(Stage.round1[2]);
            round1[i].crt = uint32(Stage.round1[3]);
            round1[i].avd = uint32(Stage.round1[4]);

            round2[i].hp = uint32(Stage.round2[0]);
            round2[i].atk = uint32(Stage.round2[1]);
            round2[i].def = uint32(Stage.round2[2]);
            round2[i].crt = uint32(Stage.round2[3]);
            round2[i].avd = uint32(Stage.round2[4]);

            round3[i].hp = uint32(Stage.round3[0]);
            round3[i].atk = uint32(Stage.round3[1]);
            round3[i].def = uint32(Stage.round3[2]);
            round3[i].crt = uint32(Stage.round3[3]);
            round3[i].avd = uint32(Stage.round3[4]);
        }

    }

    //석상 능력치 계산
    function setUnitData() public view
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
    }

    //장비 레벨 당 추가되는 능력치 계산
    function getELevel(uint level,uint k)  public pure  returns (uint32)
    {
        return uint32((level/10+1)*10+(level-1)*k);
    }

}