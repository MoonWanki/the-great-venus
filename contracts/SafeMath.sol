pragma solidity ^0.4.24;

library SafeMath {

    function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
        if (_a == 0) {
            return 0;
        }
        uint256 c = _a * _b;
        require(c / _a == _b);
        return c;
    }

    function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b > 0);
        return _a / _b;
    }

    function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b <= _a);
        return _a - _b;
    }

    function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
        uint256 c = _a + _b;
        require(c >= _a);
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

library SafeMath32 {

    function mul(uint32 _a, uint32 _b) internal pure returns (uint32) {
        if (_a == 0) {
            return 0;
        }
        uint32 c = _a * _b;
        require(c / _a == _b);
        return c;
    }

    function div(uint32 _a, uint32 _b) internal pure returns (uint32) {
        require(_b > 0);
        return _a / _b;
    }

    function sub(uint32 _a, uint32 _b) internal pure returns (uint32) {
        require(_b <= _a);
        return _a - _b;
    }

    function add(uint32 _a, uint32 _b) internal pure returns (uint32) {
        uint32 c = _a + _b;
        require(c >= _a);
        return c;
    }

    function mod(uint32 a, uint32 b) internal pure returns (uint32) {
        require(b != 0);
        return a % b;
    }
}

library SafeMath16 {

    function mul(uint16 _a, uint16 _b) internal pure returns (uint16) {
        if (_a == 0) {
            return 0;
        }
        uint16 c = _a * _b;
        require(c / _a == _b);
        return c;
    }

    function div(uint16 _a, uint16 _b) internal pure returns (uint16) {
        require(_b > 0);
        return _a / _b;
    }

    function sub(uint16 _a, uint16 _b) internal pure returns (uint16) {
        require(_b <= _a);
        return _a - _b;
    }

    function add(uint16 _a, uint16 _b) internal pure returns (uint16) {
        uint16 c = _a + _b;
        require(c >= _a);
        return c;
    }

    function mod(uint16 a, uint16 b) internal pure returns (uint16) {
        require(b != 0);
        return a % b;
    }
}

library SafeMath8 {

    function mul(uint8 _a, uint8 _b) internal pure returns (uint8) {
        if (_a == 0) {
            return 0;
        }
        uint8 c = _a * _b;
        require(c / _a == _b);
        return c;
    }

    function div(uint8 _a, uint8 _b) internal pure returns (uint8) {
        require(_b > 0);
        return _a / _b;
    }

    function sub(uint8 _a, uint8 _b) internal pure returns (uint8) {
        require(_b <= _a);
        return _a - _b;
    }

    function add(uint8 _a, uint8 _b) internal pure returns (uint8) {
        uint8 c = _a + _b;
        require(c >= _a);
        return c;
    }

    function mod(uint8 a, uint8 b) internal pure returns (uint8) {
        require(b != 0);
        return a % b;
    }
}