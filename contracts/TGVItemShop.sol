pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVItemShop is TGVBase {

    using SafeMath for uint;
    using SafeMath8 for uint8;

    uint public basicFee = 1 finney;
    uint public basicSoul = 5;
    uint public upgradeFeeDivFactor = 2;
    uint public crtPrice = 10 finney;
    uint public avdPrice = 10 finney;

    function buyEquip(uint statueNo, uint part, uint8 look, uint8 beautyLevel) external payable {
        require(part >= 1 && part <= 5);
        if(part == 1) {
            require(msg.value == basicFee);
            statueEquipInfo[msg.sender][statueNo].hpEquipLook = look;
            statueEquipInfo[msg.sender][statueNo].hpEquipLevel = 1;
        } else if(part == 2) {
            require(msg.value == basicFee);
            statueEquipInfo[msg.sender][statueNo].atkEquipLook = look;
            statueEquipInfo[msg.sender][statueNo].atkEquipLevel = 1;
        } else if(part == 3) {
            require(msg.value == basicFee);
            statueEquipInfo[msg.sender][statueNo].defEquipLook = look;
            statueEquipInfo[msg.sender][statueNo].defEquipLevel = 1;
        } else if(part == 4) {
            require(msg.value == crtPrice*beautyLevel);
            statueEquipInfo[msg.sender][statueNo].crtEquipLook = look;
            statueEquipInfo[msg.sender][statueNo].crtEquipLevel = beautyLevel;
        } else if(part == 5) {
            require(msg.value == avdPrice*beautyLevel);
            statueEquipInfo[msg.sender][statueNo].avdEquipLook = look;
            statueEquipInfo[msg.sender][statueNo].avdEquipLevel = beautyLevel;
        }
    }

    function getUpgradeCost(uint statueNo, uint part, uint currentEquipLevel) public view returns(uint, uint) {
        require(part >= 1 && part <= 3 && currentEquipLevel > 0);
        return (
            basicSoul.add((getExtraValueByEquip(statueNo, part, currentEquipLevel.add(1))-getExtraValueByEquip(statueNo, part, currentEquipLevel))/upgradeFeeDivFactor),
            basicFee.mul(currentEquipLevel.sub(1)/10 + 1)
        );
    }

    function upgradeEquip(uint statueNo, uint part, uint currentEquipLevel) external payable {
        require(part >= 1 && part <= 3);
        uint requiredSoul;
        uint fee;
        (requiredSoul, fee) = getUpgradeCost(statueNo, part, currentEquipLevel);
        require(msg.value == fee && users[msg.sender].soul >= requiredSoul);
        users[msg.sender].soul -= uint32(requiredSoul);
        if(part == 1) statueEquipInfo[msg.sender][statueNo].hpEquipLevel = statueEquipInfo[msg.sender][statueNo].hpEquipLevel.add(1);
        else if(part == 2) statueEquipInfo[msg.sender][statueNo].atkEquipLevel = statueEquipInfo[msg.sender][statueNo].atkEquipLevel.add(1);
        else if(part == 3) statueEquipInfo[msg.sender][statueNo].defEquipLevel = statueEquipInfo[msg.sender][statueNo].defEquipLevel.add(1);
    }

    function editPriceList(uint _basicFee, uint _basicSoul, uint _upgradeFeeDivFactor, uint _crtPrice, uint _avdPrice) external onlyOwner {
        basicFee = _basicFee;
        basicSoul = _basicSoul;
        upgradeFeeDivFactor = _upgradeFeeDivFactor;
        crtPrice = _crtPrice;
        avdPrice = _avdPrice;
    }
}