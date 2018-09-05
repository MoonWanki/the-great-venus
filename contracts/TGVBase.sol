pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;
import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVBase is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;

    uint public balance;       // 금고. 사용자 결제금을 모아서 정기적으로 티어별 차등 분배

    // 유저 DB
    uint numUsers; // 총 유저 수
    mapping (address => User) public users;

    // 스테이지 DB
    uint numStageInfo; // 구현된 스테이지 개수
    mapping (uint => StageInfo) stageInfoList;

    // 석상 DB
    uint numStatueInfo; // 구현된 석상 수
    mapping (uint => UnitInfo) public statueInfoList;

    // 몬스터 DB
    uint numMobInfo; // 구현된 몬스터 수
    mapping (uint => UnitInfo) public mobInfoList;

    // 레벨 당 요구 경험치
    uint numRequiredExp; // 최대 레벨
    mapping (uint => uint) public requiredExp;


    // 구현된 스테이지인지
    modifier onlyValidStageNo(uint _no) {
        require(_no > 0 && _no <= numStageInfo, "out of stage range");
        _;
    }


    // 구현된 석상인지
    modifier onlyValidStatueNo(uint _no) {
        require(_no > 0 && _no <= numStatueInfo, "out of statue range");
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
        uint32 level;
        uint32 lastStage;
        uint32 numStatues;
        mapping (uint => Equip) equipList;
    }

    struct Equip {
        uint32 hpEquipType;     // HP 장비 종류
        uint32 hpEquipLevel;    // HP 장비 레벨
        uint32 atkEquipType;    // 공격력 장비 종류
        uint32 atkEquipLevel;   // 공격력 장비 레벨
        uint32 defEquipType;    // 방어력 장비 종류
        uint32 defEquipLevel;   // 방어력 장비 레벨
        uint32 crtEquipType;    // 크리티컬 장비 종류
        uint32 avdEquipType;    // 회피율 장비 종류
    }

    // 유닛
    struct UnitInfo {
        uint32 hp;      // 기본 HP
        uint32 atk;     // 기본 공격력
        uint32 def;     // 기본 방어력
        uint32 crt;     // 기본 크리티컬 확률
        uint32 avd;     // 기본 회피율
    }

    struct StageInfo {
        uint[5] round1;
        uint[5] round2;
        uint[5] round3;
    }

    function getMyInfo() external view returns (
        string name,
        uint rank,
        uint gold,
        uint exp,
        uint level,
        uint lastStage,
        uint numStatues,
        uint[] Localequiplist
    ) 
    {
        uint[] memory localequiplist;
        for(uint i = 0;i<numStatues;i++)
        {
            localequiplist[i*10] = users[msg.sender].equipList[i+1].hpEquipType;
            localequiplist[i*10+1] = users[msg.sender].equipList[i+1].hpEquipLevel;
            localequiplist[i*10+2] = users[msg.sender].equipList[i+1].atkEquipType;
            localequiplist[i*10+3] = users[msg.sender].equipList[i+1].atkEquipLevel;
            localequiplist[i*10+4] = users[msg.sender].equipList[i+1].defEquipType;
            localequiplist[i*10+5] = users[msg.sender].equipList[i+1].defEquipLevel;
            localequiplist[i*10+6] = users[msg.sender].equipList[i+1].crtEquipType;
            localequiplist[i*10+7] = users[msg.sender].equipList[i+1].avdEquipType;
        }
        return (
            users[msg.sender].name,
            users[msg.sender].rank,
            users[msg.sender].gold,
            users[msg.sender].exp,
            users[msg.sender].level,
            users[msg.sender].lastStage,
            users[msg.sender].numStatues,
            localequiplist
        );
    }

    // 신규 유저 생성.
    function createUser(string _name) external returns (string) {
        users[msg.sender] = User(_name, 0, 0, 0, 1, 0, 1);
        if(users[msg.sender].level == 0)
        {   
            numUsers.add(1);
        }
        return (
            users[msg.sender].name
        );
    }

    function isAdmin() external view returns (bool) {
        if(msg.sender == owner) return true;
        else return false;
    }
    
}