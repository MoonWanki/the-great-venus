pragma solidity ^0.4.22;

import "./zeppelin/ownership/Ownable.sol";
import "./zeppelin/math/SafeMath.sol";

contract TGVBase is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;

    uint public balance;       // 금고. 사용자 결제금을 모아서 정기적으로 티어별 차등 분배

    uint numUsers;
    mapping (address => User) public users;                // 유저 DB

    uint numStageInfo;
    mapping (uint => StageInfo) stageInfoList;      // 스테이지 DB

    uint numStatueInfo;
    mapping (uint => UnitInfo) public statueInfoList;      // 석고상 ID - 석고상 정보

    uint numMobInfo;
    mapping (uint => UnitInfo) public mobInfoList;         // 몬스터 ID - 몬스터 정보

    uint numRequiredExp;
    mapping (uint => uint) public requiredExp;             // 레벨 당 요구 경험치


    // 아이템 관련 코드 필요

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
        mapping (uint => Statue) statues;
    }

    struct Statue {
        uint32 hpEquipType;     // HP 장비 종류
        uint32 atkEquipType;    // 공격력 장비 종류
        uint32 defEquipType;    // 방어력 장비 종류
        uint32 crtEquipType;    // 크리티컬 장비 종류
        uint32 avdEquipType;    // 회피율 장비 종류
        uint32 hpEquipLevel;    // HP 장비 레벨
        uint32 atkEquipLevel;   // 공격력 장비 레벨
        uint32 defEquipLevel;   // 방어력 장비 레벨
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

    modifier onlyValidStageNo(uint _no) {
        require(_no > 0 && _no <= numStageInfo, "out of stage range");
        _;
    }

    modifier onlyValidStatueNo(uint _no) {
        require(_no > 0 && _no <= numStatueInfo, "out of statue range");
        _;
    }

    modifier onlyValidMobNo(uint _no) {
        require(_no > 0 && _no <= numMobInfo, "out of mob range");
        _;
    }

    function getMyInfo() external view returns (
        string name,
        uint rank,
        uint gold,
        uint exp,
        uint level,
        uint lastStage,
        uint numStatues
    ) {
        return (
            users[msg.sender].name,
            users[msg.sender].rank,
            users[msg.sender].gold,
            users[msg.sender].exp,
            users[msg.sender].level,
            users[msg.sender].lastStage,
            users[msg.sender].numStatues
        );
    }

    // 신규 유저 생성.
    function createUser(string _name) external returns (string) {
        users[msg.sender] = User(_name, 0, 0, 0, 1, 0, 1);
        numUsers.add(1);
        return (users[msg.sender].name);
    }
    
}