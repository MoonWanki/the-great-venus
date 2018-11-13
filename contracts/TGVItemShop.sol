pragma solidity ^0.4.24;
import "./SafeMath.sol";
import "./TGVBase.sol";

contract TGVItemShop is TGVBase {

    using SafeMath for uint;
    using SafeMath8 for uint8;

    uint public equipIncreaseDivFactor = 23;
    uint public equipBigIncreaseDivFactor = 6;
    uint public equipIncreasePowerDivFactor = 3;
    
    uint public extraCrtPerEquipLevel = 10;
    uint public extraAvdPerEquipLevel = 5;

    uint public basicFee = 1 finney;
    uint public basicSorbiote = 5;
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
            basicSorbiote.add((getExtraValueByEquip(statueNo, part, currentEquipLevel.add(1))-getExtraValueByEquip(statueNo, part, currentEquipLevel))/upgradeFeeDivFactor),
            basicFee.mul(currentEquipLevel.sub(1)/10 + 1)
        );
    }

    function upgradeEquip(uint statueNo, uint part, uint currentEquipLevel) external payable {
        require(part >= 1 && part <= 3);
        uint requiredSorbiote;
        uint fee;
        (requiredSorbiote, fee) = getUpgradeCost(statueNo, part, currentEquipLevel);
        require(msg.value == fee && users[msg.sender].sorbiote >= requiredSorbiote);
        users[msg.sender].sorbiote -= uint32(requiredSorbiote);
        if(part == 1) statueEquipInfo[msg.sender][statueNo].hpEquipLevel = statueEquipInfo[msg.sender][statueNo].hpEquipLevel.add(1);
        else if(part == 2) statueEquipInfo[msg.sender][statueNo].atkEquipLevel = statueEquipInfo[msg.sender][statueNo].atkEquipLevel.add(1);
        else if(part == 3) statueEquipInfo[msg.sender][statueNo].defEquipLevel = statueEquipInfo[msg.sender][statueNo].defEquipLevel.add(1);
    }

    function editPriceList(uint _basicFee, uint _basicSorbiote, uint _upgradeFeeDivFactor, uint _crtPrice, uint _avdPrice) external onlyOwner {
        basicFee = _basicFee;
        basicSorbiote = _basicSorbiote;
        upgradeFeeDivFactor = _upgradeFeeDivFactor;
        crtPrice = _crtPrice;
        avdPrice = _avdPrice;
    }

    function getExtraValueByEquip(uint statueNo, uint part, uint equipLevel) public view returns (uint) {
        require(part >= 1 && part <= 5);
        if(equipLevel==0) return 0;
        if(part == 1)
            return (statueInfoList[statueNo].hp/equipIncreaseDivFactor).mul(equipLevel).add((statueInfoList[statueNo].hp/equipBigIncreaseDivFactor).mul(((equipLevel-1)/10)**2)).add(equipLevel**2/equipIncreasePowerDivFactor);
        if(part == 2)
            return (statueInfoList[statueNo].atk/equipIncreaseDivFactor).mul(equipLevel).add((statueInfoList[statueNo].atk/equipBigIncreaseDivFactor).mul(((equipLevel-1)/10)**2)).add(equipLevel**2/equipIncreasePowerDivFactor);
        if(part == 3)
            return (statueInfoList[statueNo].def/equipIncreaseDivFactor).mul(equipLevel).add((statueInfoList[statueNo].def/equipBigIncreaseDivFactor).mul(((equipLevel-1)/10)**2)).add(equipLevel**2/equipIncreasePowerDivFactor);
        if(part == 4)
            return equipLevel * extraCrtPerEquipLevel;
        if(part == 5)
            return equipLevel * extraAvdPerEquipLevel;
    }
}