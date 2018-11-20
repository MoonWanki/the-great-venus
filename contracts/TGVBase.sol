pragma solidity ^0.4.24;
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
    uint public levelIncreaseDivFactor = 17;

    mapping(address => User) public users;
    mapping(address => mapping(uint => uint)) public defaultStatueLook;
    mapping(address => mapping(uint => EquipInfo)) public statueEquipInfo;
    mapping(uint => Unit) public statueInfoList;
    mapping(uint => Unit) public mobInfoList;
    mapping(uint => uint) public expSpoiledByMob;
    mapping(uint => mapping(uint => uint[])) public stageInfoList;
    mapping(uint => uint) public statueAcquisitionStage;
    mapping(uint => address) public rankToOwner;

    constructor() public {
        owner = msg.sender;
        statueInfoList[0] = Unit(500, 150, 120, 10, 5);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function kill() public payable onlyOwner {
        selfdestruct(owner);
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
        numUsers = numUsers.add(1);
        users[msg.sender] = User(name, uint32(numUsers), 0, 0, 1, 0, 1, 0);
        for(uint i = 0 ; i < look.length ; i++)
            defaultStatueLook[msg.sender][i] = look[i];
        rankToOwner[numUsers] = msg.sender;
    }

    function getRequiredExp(uint level) public pure returns(uint) {
        uint increase = 100;
        uint sum = 100;
        for(uint i = 1 ; i < level ; i++)
        {
            increase = increase.mul(20/i + 21)/20;
            sum = sum.add(increase);
        }
        return sum;
    }

    function getStatueRawSpec(uint statueNo, uint level) public view returns (uint, uint, uint, uint, uint) {
        return (
            statueInfoList[statueNo].hp.add((statueInfoList[statueNo].hp/levelIncreaseDivFactor).mul(level.sub(1))),
            statueInfoList[statueNo].atk.add((statueInfoList[statueNo].atk/levelIncreaseDivFactor).mul(level.sub(1))),
            statueInfoList[statueNo].def.add((statueInfoList[statueNo].def/levelIncreaseDivFactor).mul(level.sub(1))),
            statueInfoList[statueNo].crt,
            statueInfoList[statueNo].avd
        );
    }

    function getMobRawSpec(uint mobNo, uint level) public view returns (uint, uint, uint, uint, uint) {
        return (
            mobInfoList[mobNo].hp.add((mobInfoList[mobNo].hp/levelIncreaseDivFactor).mul(level.sub(1))),
            mobInfoList[mobNo].atk.add((mobInfoList[mobNo].hp/levelIncreaseDivFactor).mul(level.sub(1))),
            mobInfoList[mobNo].def.add((mobInfoList[mobNo].hp/levelIncreaseDivFactor).mul(level.sub(1))),
            mobInfoList[mobNo].crt,
            mobInfoList[mobNo].avd
        );
    }

    function getStageInfo(uint stageNo) public view returns (uint[], uint[], uint[]) {
        return (stageInfoList[stageNo][1], stageInfoList[stageNo][2], stageInfoList[stageNo][3]);
    }
    
    function editLevelIncreaseFactor(uint _levelIncreaseDivFactor) external onlyOwner {
        levelIncreaseDivFactor = _levelIncreaseDivFactor;
    }

    function increaseMaxStatue() external onlyOwner {
        maxStatue = maxStatue.add(1);
    }

    function increaseMaxMob() external onlyOwner {
        maxMob = maxMob.add(1);
    }

    function increaseMaxStage() external onlyOwner {
        maxStage = maxStage.add(1);
    }

    function editStatueInfo(
        uint statueNo,
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint acquisitionStage
    ) external onlyOwner onlyValidStatueNo(statueNo) {
        statueInfoList[statueNo].hp = hp;
        statueInfoList[statueNo].atk = atk;
        statueInfoList[statueNo].def = def;
        statueInfoList[statueNo].crt = crt;
        statueInfoList[statueNo].avd = avd;
        statueAcquisitionStage[statueNo] = acquisitionStage;
    }
    
    function editMobInfo(
        uint mobNo,
        uint hp,
        uint atk,
        uint def,
        uint crt,
        uint avd,
        uint exp
    ) external onlyOwner onlyValidMobNo(mobNo) {
        mobInfoList[mobNo].hp = hp;
        mobInfoList[mobNo].atk = atk;
        mobInfoList[mobNo].def = def;
        mobInfoList[mobNo].crt = crt;
        mobInfoList[mobNo].avd = avd;
        expSpoiledByMob[mobNo] = exp;
    }

    function editStageRoundInfo(uint stageNo, uint roundNo, uint[] mobNoList)
    public onlyOwner onlyValidStageNo(stageNo) {
        stageInfoList[stageNo][roundNo] = new uint[](mobNoList.length);
        stageInfoList[stageNo][roundNo] = mobNoList;
    }

    struct User {
        string name;
        uint32 rank;
        uint32 exp;
        uint32 sorbiote;
        uint32 level;
        uint32 lastStage;
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

    struct Unit {
        uint hp;
        uint atk;
        uint def;
        uint crt;
        uint avd;
    }
}