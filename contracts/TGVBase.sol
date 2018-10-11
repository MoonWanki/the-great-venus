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

    // 레벨 당 요구 경험치
    uint public numRequiredExp; // 최대 레벨
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
        uint8 level;
        uint8 lastStage;
        uint8 numStatues;
        uint8 randnance;
    }

    struct Equip {
        uint16 hpEquipType;     // HP 장비 종류
        uint16 hpEquipLevel;    // HP 장비 레벨
        uint16 atkEquipType;    // 공격력 장비 종류
        uint16 atkEquipLevel;   // 공격력 장비 레벨
        uint16 defEquipType;    // 방어력 장비 종류
        uint16 defEquipLevel;   // 방어력 장비 레벨
        uint16 crtEquipType;    // 크리티컬 장비 종류
        uint16 avdEquipType;    // 회피율 장비 종류
    }

    // 유닛
    struct UnitInfo {
        uint16 hp;      // 기본 HP
        uint16 atk;     // 기본 공격력
        uint16 def;     // 기본 방어력
        uint16 crt;     // 기본 크리티컬 확률
        uint16 avd;     // 기본 회피율
    }

    struct RoundResult
    {
        // 1. 누가 누굴 공격?
        // 2. damage량
        // 3. 크리티컬 유무
        uint8[] attacker;
        uint8[] mattchar;
        uint[] damage;
        bool[] isCrk;

    }

}