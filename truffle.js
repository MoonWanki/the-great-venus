var HDWalletProvider = require("truffle-hdwallet-provider");
var infura_apikey = "XXXXXX";
var mnemonic = "twelve words you can find in metamask/settings/reveal seed words blabla";

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 7545,
      network_id: "*",
      gas: 10000000,
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey);
      },
      network_id: '3',
    },
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
