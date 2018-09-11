// Allows us to use ES6 in our migrations and tests.
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "pelican dinner keen guilt ocean october brick key lab short lecture fatigue";

require('babel-register')

module.exports = {
    networks: {
	development: {
	    host: "localhost",
	    port: 8545,
	    network_id: "*", // Match any network id
	    gasPrice: 200000000000
	},
	rinkeby: {
	    provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"),  //hgffnOxaTu7Ydsu5VlTg
	    network_id: 3
	}
  }
};
