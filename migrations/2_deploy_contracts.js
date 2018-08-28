var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var TGVBase = artifacts.require("./TGVBase.sol");
var TGVConfig = artifacts.require("./TGVConfig.sol");
var TGVItemShop = artifacts.require("./TGVItemShop.sol");
var TGVStageClear = artifacts.require("./TGVStageClear.sol");
var TGVUserBattle = artifacts.require("./TGVUserBattle.sol");
var TGV = artifacts.require("./TGV.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, [TGVBase, TGVConfig]);
  deployer.deploy(Ownable);
  deployer.link(Ownable, TGVBase);
  deployer.deploy(TGVBase);
  deployer.link(TGVBase, TGVConfig);
  deployer.deploy(TGVConfig);
  deployer.link(TGVConfig, TGVItemShop);
  deployer.deploy(TGVItemShop);
  deployer.link(TGVItemShop, TGVStageClear);
  deployer.deploy(TGVStageClear);
  deployer.link(TGVStageClear, TGVUserBattle);
  deployer.deploy(TGVUserBattle);
  deployer.link(TGVUserBattle, TGV);
  deployer.deploy(TGV);
};
