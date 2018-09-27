pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVConfig.sol";

contract TGVItemShop is TGVConfig {
    
    ////// 장비 DB
    function getEquip(uint unit_num)public view returns (Equip)
    {
        //unit_num - 석상 인덱스
        Equip memory equip = equipList[msg.sender][unit_num];
        return equip;
    }
    function reinforceEquip(uint32 unit_num, uint32 equip_num) public
    {
        if(equip_num==1)
            equipList[msg.sender][unit_num].hpEquipLevel += 1;
        if(equip_num==2)
            equipList[msg.sender][unit_num].atkEquipLevel += 1;
        if(equip_num==3)
            equipList[msg.sender][unit_num].defEquipLevel += 1;
    }
}