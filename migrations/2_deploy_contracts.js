var TGVBase = artifacts.require("./TGVBase.sol");
var TGVConfig = artifacts.require("./TGVConfig.sol");
var TGVItemShop = artifacts.require("./TGVItemShop.sol");
var TGVStageClear = artifacts.require("./TGVStageClear.sol");
var TGVUserBattle = artifacts.require("./TGVUserBattle.sol");
var TGV = artifacts.require("./TGV.sol");

module.exports = function(deployer) {
  deployer.deploy(TGVBase);
  deployer.link(TGVBase, [TGVConfig, TGVConfig, TGVItemShop, TGVStageClear]);
  deployer.deploy(TGVConfig);
  deployer.deploy(TGVItemShop);
  deployer.deploy(TGVStageClear);
  deployer.deploy(TGVUserBattle);
  deployer.deploy(TGV);
};
