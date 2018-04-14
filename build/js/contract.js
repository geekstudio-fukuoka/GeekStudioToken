window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
    onlyRopstenTestNetwork(main);
  } else {
    document.write("Please install <a href='https://metamask.io/'>MetaMask</a>.")
  }
})

function onlyRopstenTestNetwork(cb) {
  web3.version.getNetwork(function(err, netId) {
    if (netId === "3") {
      cb();
    } else {
      document.write("Please switch MetaMask to Ropsten Test Network and reload page.");
    }
  });
}

var contractAddress = "0xfc04fda2ffdb13ab427f6d3bccf4b8eb61c8e5e9";
var abiArray = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

function main() {
  var defaultAccount = web3.eth.defaultAccount;
  var contract = web3.eth.contract(abiArray).at(contractAddress);
  contract.name(function(err, name){
    if(err) throw err;
    contract.symbol(function(err, symbol){
      if(err) throw err;
      contract.balanceOf(defaultAccount, function(err, balance){
        if(err) throw err;
        initializeApp(defaultAccount, contract, name, symbol, balance);
      });
    });
  });
}

function initializeApp(defaultAccount, contract, name, symbol, balance) {
  new Vue({
    el: '#js-app',
    data: {
      defaultAccount: defaultAccount, // 選択されているEhtereumアカウント
      name: name,                     // トークンの名前
      symbol: symbol,                 // トークンのシンボル
      balance: balance,               // トークンをいくら所持しているか
      to: "",                         // 送金先アドレス
      amount: 0,                      // 送金する量
      history: ""                     // 送金トランザクションのハッシュ
    },
    methods: {
      // 残高の表示を整形するメソッド
      showBalance: function(balance) {
        return (balance / 1e18).toFixed(2);
      },
      // 送金するメソッド
      send: function() {
        var $this = this;
        var sendAmount = this.amount * 1e18;
        contract.transfer(this.to, sendAmount, {from: defaultAccount}, function(err, txhash){
          if (err) throw err;
          $this.history = txhash;
          contract.balanceOf(defaultAccount, function(err, balance){
            $this.balance = balance;
          });
        });
      }
    }
  })
}
