pragma solidity ^0.4.22;
import "./SafeMath.sol";

contract TGVBase {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath8 for uint8;

    address public owner;
    uint public numUsers;
    uint public maxStatue;
    uint public maxMob;
    uint public maxStage;
    uint public extraHpPerUnitLevel;
    uint public extraAtkPerUnitLevel;
    uint public extraDefPerUnitLevel;
    uint32 public extraHpPerEquipLevel;
    uint32 public extraAtkPerEquipLevel;
    uint32 public extraDefPerEquipLevel;
    uint8 public extraCrtPerEquipLevel;
    uint8 public extraAvdPerEquipLevel;

    mapping(address => User) public users;
    mapping(address => mapping(uint => uint)) public defaultStatueLook;
    mapping(address => mapping(uint => EquipInfo)) public statueEquipInfo;
    mapping(uint => UnitInfo) public statueInfoList;
    mapping(uint => UnitInfo) public mobInfoList;
    mapping(uint => mapping(uint => uint[])) public stageInfoList;
    mapping(uint => uint) public statueAcquisitionStage;

    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) owner = newOwner;
    }

    modifier onlyValidStatueNo(uint _no) {
        require(_no >= 0 && _no <= maxStatue);
        _;
    }

    modifier onlyValidMobNo(uint _no) {
        require(_no > 0 && _no <= maxMob);
        _;
    }
    
    modifier onlyValidStageNo(uint _no) {
        require(_no > 0 && _no <= maxStage);
        _;
    }

    function createUser(string name, uint[] look) external {
        require(users[msg.sender].level == 0);
        numUsers.add(1);
        users[msg.sender] = User(name, 0, 0, uint32(numUsers), 1, 0, 1, 0);
        for(uint i = 0 ; i < look.length ; i++)
            defaultStatueLook[msg.sender][i+1] = look[i];
    }

    // returns required exp to reach given level
    function getRequiredExp(uint level) public pure returns(uint) {
        uint sum = 0;
        for(uint i = 1 ; i <= level ; i++)
        {
            sum += (1000*i);
        }
        return sum;
    }

    // returns exp emitted by a mob of given level
    function getMobExp(uint level) public pure returns(uint) {
        return 200 + 100 * level.sub(1);
    }

    function getStatueRawSpec(uint statueNo, uint16 level) public view returns (uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd) {
        return (
            statueInfoList[statueNo].hp.add(statueInfoList[statueNo].hp.div(10).mul(uint32(level))),
            statueInfoList[statueNo].atk.add(statueInfoList[statueNo].atk.div(10).mul(uint32(level))),
            statueInfoList[statueNo].def.add(statueInfoList[statueNo].def.div(10).mul(uint32(level))),
            statueInfoList[statueNo].crt,
            statueInfoList[statueNo].avd
        );
    }

    function getMobRawSpec(uint mobNo, uint16 level) public view returns (uint32 hp, uint32 atk, uint32 def, uint8 crt, uint8 avd) {
        return (
            mobInfoList[mobNo].hp.add(mobInfoList[mobNo].hp.div(10).mul(uint32(level))),
            mobInfoList[mobNo].atk.add(mobInfoList[mobNo].atk.div(10).mul(uint32(level))),
            mobInfoList[mobNo].def.add(mobInfoList[mobNo].def.div(10).mul(uint32(level))),
            mobInfoList[mobNo].crt,
            mobInfoList[mobNo].avd
        );
    }

    function getExtraValueByEquipLevel(uint part, uint8 equipLevel) public view returns (uint32) {
        require(part >= 1 && part <= 3);
        if(equipLevel==0) return 0;
        if(part == 1)
            return extraHpPerEquipLevel.mul(uint32(equipLevel)).add(uint32(equipLevel).sub(1).div(10).mul(extraHpPerEquipLevel.mul(10)));
        if(part == 2)
            return extraAtkPerEquipLevel.mul(uint32(equipLevel)).add(uint32(equipLevel).sub(1).div(10).mul(extraAtkPerEquipLevel.mul(10)));
        if(part == 3)
            return extraDefPerEquipLevel.mul(uint32(equipLevel)).add(uint32(equipLevel).sub(1).div(10).mul(extraDefPerEquipLevel.mul(10)));
    }

    function getStageInfo(uint stageNo) public view returns (uint[] round1, uint[] round2, uint[] round3) {
        return (stageInfoList[stageNo][1], stageInfoList[stageNo][2], stageInfoList[stageNo][3]);
    }
    
    struct User {
        string name;
        uint64 exp;
        uint32 gem;
        uint32 rank;
        uint16 level;
        uint16 lastStage;
        uint8 numStatues;
        uint8 randNonce;
    }

    struct EquipInfo {
        uint8 hpEquipLook;
        uint8 atkEquipLook;
        uint8 defEquipLook;
        uint8 crtEquipLook;
        uint8 avdEquipLook;
        uint8 hpEquipLevel;
        uint8 atkEquipLevel;
        uint8 defEquipLevel;
        uint8 crtEquipLevel;
        uint8 avdEquipLevel;
    }

    struct UnitInfo {
        uint32 hp;
        uint32 atk;
        uint32 def;
        uint8 crt;
        uint8 avd;
    }
}