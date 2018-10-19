pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVBase is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;

    uint public balance;       // 금고. 사용자 결제금을 모아서 정기적으로 티어별 차등 분배

    // 유저 DB
    uint public numUsers; // 총 유저 수
    mapping (address => User) public users;

    // 유저 석고상 DB
    mapping (address => UserAppearance) public UserAppearanceList;

    // 장비 DB
    uint public numEquips; // 총 장비명세서  수 - 총 유저수와 동일
    mapping (address => mapping (uint => Equip)) public equipList;

    // 스테이지 DB
    uint8 public numStageInfo; // 구현된 스테이지 개수
    mapping (uint8 => uint8[15]) public stageInfoList;

    // 석상 DB
    uint8 public numStatueInfo; // 구현된 석상 수
    mapping (uint => UnitInfo) public statueInfoList;

    // 몬스터 DB
    uint8 public numMobInfo; // 구현된 몬스터 수
    mapping (uint => UnitInfo) public mobInfoList;

    uint8 public numConstForUnit;   
    mapping (uint8 => uint8) public constForUnit;   // 석고상 추가 능력치 계산 상수
    
    uint8 public numConstForEquip;  
    mapping (uint8 => uint8) public constForEquip;  // 장비 추가 능력치 계산 상수

    uint8 public numGetStatueNumList;
    mapping (uint8 => uint8) public GetStatueNumList;  // 석상 획득 가능한 스테이지 번호

    // 구현된 스테이지인지
    modifier onlyValidStageNo(uint _no) {
        require(_no > 0 && _no <= numStageInfo, "out of stage range");
        _;
    }

    // 구현된 석상인지
    modifier onlyValidStatueNo(uint _no) {
        require(_no >= 0 && _no <= numStatueInfo, "out of statue range");
        _;
    }

    // 구현된 몬스터인지
    modifier onlyValidMobNo(uint _no) {
        require(_no > 0 && _no <= numMobInfo, "out of mob range");
        _;
    }

    uint numCrtEquipType;   // 크리티컬 장비 종류 개수 
    uint numAvdEquipType;   // 회피율 장비 종류 개수

    // 유저 정보
    struct User {
        string name;
        uint rank;
        uint gold;
        uint exp;
        uint8 level;
        uint8 lastStage;
        uint8 numStatues;
        uint16 randnance;
    }

    // 유저 석고상 정보
    struct UserAppearance{
        uint8 hairStyle;
        uint8 skinColor;
        uint8 eyeType;
    }

    // 석고상 장비 정보
    struct Equip {
        uint16 hpEquipType;     // HP 장비 종류
        uint16 hpEquipLevel;    // HP 장비 레벨
        uint16 atkEquipType;    // 공격력 장비 종류
        uint16 atkEquipLevel;   // 공격력 장비 레벨
        uint16 defEquipType;    // 방어력 장비 종류
        uint16 defEquipLevel;   // 방어력 장비 레벨
        uint16 crtEquipType;    // 크리티컬 장비 종류
        uint16 crtEquipLevel;    // 크리티컬 장비 레벨
        uint16 avdEquipType;    // 회피율 장비 종류
        uint16 avdEquipLevel;    // 회피율 장비 레벨
    }

    // 유닛
    struct UnitInfo {
        uint16 hp;      // 기본 HP
        uint16 atk;     // 기본 공격력
        uint16 def;     // 기본 방어력
        uint16 crt;     // 기본 크리티컬 확률
        uint16 avd;     // 기본 회피율
    }

    function createUser(string _name) external {
        if(users[msg.sender].level == 0) numUsers.add(1);
        users[msg.sender] = User(_name, 0, 0, 0, 1, 0, 1, 0);
    }

    //레벨업 시 필요 경험치.
    function getRequiredExp(uint level) public pure returns(uint)
    {
        uint sum = 0;
        for(uint8 i = 1;i<=level;i++)
        {
            sum += (1000*i);
        }
        return sum;
    }

    //몬스터 당 획득 경험치.
    function getMobExp(uint level) public pure returns (uint)
    {
        return 200 + 100 * (level-1);
    }

    // 레벨 당 추가 능력치
    function getExtraUnitValue(uint8 unitValueType, uint unitlevel) public view returns (uint16)
    {
        return uint16(unitlevel * constForUnit[unitValueType] * 2);
    }

    // 추가 장비 능력치.
    function getExtraEquipValue(uint8 Part, uint16 EquipLevel) public view returns (uint16)
    {
        uint8 const = constForEquip[0];
        if(Part >= 1 && Part <= 3)
        {
            if(EquipLevel%10 == 0)
                const += 1;
            return constForEquip[Part]*EquipLevel + const;
        }

        if(Part >= 4 && Part <= 5)
        {
            return constForEquip[Part]*EquipLevel;
        }
    }
}