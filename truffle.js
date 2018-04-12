var GSTWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "tuna tag label man month labor view left loyal expire enforce enact";
var accessToken = "";　//Publicにあげるので削除

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new GSTWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/" + accessToken
        );
      },
      network_id: 3,
      gas: 500000,
      gasPrice: 500,
    }
  }
};
