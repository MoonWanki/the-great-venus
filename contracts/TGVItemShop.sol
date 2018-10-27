pragma solidity ^0.4.22;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVItemShop is TGVBase {

    using SafeMath8 for uint8;

    uint public hpEquipPrice = 0.003 ether;
    uint public hpUpgradeCost = 0.0006 ether;
    uint public atkEquipPrice = 0.005 ether;
    uint public atkUpgradeCost = 0.001 ether;
    uint public defEquipPrice = 0.002 ether;
    uint public defUpgradeCost = 0.0004 ether;

    function buyHpEquip(uint statueNo, uint8 look) external payable {
        require(msg.value >= hpEquipPrice);
        statueEquipInfo[msg.sender][statueNo].hpEquipLook = look;
        statueEquipInfo[msg.sender][statueNo].hpEquipLevel = 1;
    }

    function buyAtkEquip(uint statueNo, uint8 look) external payable {
        require(msg.value >= atkEquipPrice);
        statueEquipInfo[msg.sender][statueNo].atkEquipLook = look;
        statueEquipInfo[msg.sender][statueNo].atkEquipLevel = 1;
    }

    function buyDefEquip(uint statueNo, uint8 look) external payable {
        require(msg.value >= defEquipPrice);
        statueEquipInfo[msg.sender][statueNo].defEquipLook = look;
        statueEquipInfo[msg.sender][statueNo].defEquipLevel = 1;
    }

    function upgradeHpEquip(uint statueNo) external payable {
        require(msg.value >= hpUpgradeCost);
        statueEquipInfo[msg.sender][statueNo].hpEquipLevel++;
    }

    function upgradeAtkEquip(uint statueNo) external payable {
        require(msg.value >= atkUpgradeCost);
        statueEquipInfo[msg.sender][statueNo].atkEquipLevel++;
    }

    function upgradeDefEquip(uint statueNo) external payable {
        require(msg.value >= defUpgradeCost);
        statueEquipInfo[msg.sender][statueNo].defEquipLevel++;
    }

}