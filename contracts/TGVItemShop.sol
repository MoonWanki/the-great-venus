pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./TGVConfig.sol";

contract TGVItemShop is TGVConfig {

    function addEquipInfo(uint8 unit_num,uint8 equip_part,uint8 equip_type) public
    {
        if(equip_part==1)
        {
            equipList[msg.sender][unit_num].hpEquipType = equip_type;
            equipList[msg.sender][unit_num].hpEquipLevel = 1;
        }
        if(equip_part==2)
        {
            equipList[msg.sender][unit_num].atkEquipType = equip_type;
            equipList[msg.sender][unit_num].atkEquipLevel = 1;
        }
        if(equip_part==3)
        {
            equipList[msg.sender][unit_num].defEquipType = equip_type;
            equipList[msg.sender][unit_num].defEquipLevel = 1;
        }
        if(equip_part==4)
        {
            equipList[msg.sender][unit_num].crtEquipType = equip_type;
        }
        if(equip_part==5)
        {
            equipList[msg.sender][unit_num].avdEquipType = equip_type;
        }
            

    }
    function upgradeEquip(uint8 unit_num, uint8 equip_part) public
    {
        if(equip_part==1)
            equipList[msg.sender][unit_num].hpEquipLevel += 1;
        if(equip_part==2)
            equipList[msg.sender][unit_num].atkEquipLevel += 1;
        if(equip_part==3)
            equipList[msg.sender][unit_num].defEquipLevel += 1;
    }

}