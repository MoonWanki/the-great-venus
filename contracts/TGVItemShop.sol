pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVConfig.sol";

contract TGVItemShop is TGVConfig {
    
    function getEquip(uint8 unit_num) public view returns (Equip)
    {
        //unit_num - 석상 인덱스
        Equip memory equip = equipList[msg.sender][unit_num];
        return equip;
    }
    function reinforceEquip(uint8 unit_num, uint8 equip_num) public
    {
        if(equip_num==1)
            equipList[msg.sender][unit_num].hpEquipLevel += 1;
        if(equip_num==2)
            equipList[msg.sender][unit_num].atkEquipLevel += 1;
        if(equip_num==3)
            equipList[msg.sender][unit_num].defEquipLevel += 1;
    }
}