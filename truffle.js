var apikey = require('./api_key');
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  	networks: {
    	development: {
      		host: "localhost", 
      		port: 7545,
      		network_id: "*",
      		gas: 100000000,
      		gasPrice: 3000000000,
    	},
    	ropsten: {
      		provider: function() {
        		return new HDWalletProvider(apikey.mnemonic, "https://ropsten.infura.io/" + apikey.infura_apikey);
      		},
			  network_id: '3',
			  gas : 8000000,
    	},
    	solc: {
      		optimizer: {
        		enabled: true,
        		runs: 200
      		}
    	}
  	}
};
