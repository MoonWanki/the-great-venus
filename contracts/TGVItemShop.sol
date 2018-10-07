pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVConfig.sol";

contract TGVItemShop is TGVConfig {
    
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