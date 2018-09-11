const contract = require('truffle-contract');
const CryptoJS = require('crypto-js');
getTransactionReceiptMined = require("./getTransactionReceiptMined.js");
var Tx = require('ethereumjs-tx');
var coder = require('web3/lib/solidity/coder');
var request = require("request");
const notifier = require('node-notifier');
const path = require('path');
const privateKey = new Buffer('8ce30e4aee45067f4d838794c9444292fc891a8d0e34077265806137554d16cc', 'hex');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');
const metacoin_artifact2 = require('../build/contracts/GenCertificate.json');

var MetaCoin = contract(metacoin_artifact);
var GenCertificate = contract(metacoin_artifact2);

module.exports = {
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);
    GenCertificate.setProvider(self.web3.currentProvider);
    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        return;
      }

      if (accs.length == 0) {
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  matriculate: function(name, creator, degree, cel, addressHome, codeStudent, callback) {
      var self = this;
      GenCertificate.setProvider(self.web3.currentProvider);
      var MyContract = self.web3.eth.contract(GenCertificate._json.abi);

      var myContractInstance = MyContract.at('0x364d23421881d98841f706e728c939469c1309f6');
       //''
      myContractInstance.matriculate.call(name, degree, cel, addressHome, codeStudent,function(err,outhash) {


        var getData = myContractInstance.matriculate.getData(name, degree, cel, addressHome, codeStudent);

        var nonce = self.web3.toHex(self.web3.eth.getTransactionCount(creator));
        var gasPrice = self.web3.toHex(self.web3.eth.gasPrice);
        var gasLimitHex = self.web3.toHex(2000000);
        var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': creator, 'to':'0x364d23421881d98841f706e728c939469c1309f6', 'data': getData};

        var tx = new Tx(rawTx);
        tx.sign(privateKey);

        var serializedTx = '0x'+tx.serialize().toString('hex');

        self.web3.eth.sendRawTransaction(serializedTx, function(err, txHash){
          console.log(err, txHash);
          notifier.notify({
          title: 'Matricula',
          message: 'Se esta minando la matricula '+outhash,
          icon: path.join(__dirname, 'public_static/imgs/logo.jpg'),
          });
          self.getTransactionReceiptMined(txHash).then(function(receipt) {
            console.log("receipt");
            console.log(receipt);
            notifier.notify({
            title: 'Matricula',
            message: 'La matricula del estudiante '+name+' ya se a minado, el hash correspondiente es: '+outhash,
            icon: path.join(__dirname, '../public_static/imgs/logo.jpg'),
            time: 20000,
            sticky: false,
            label: void 0,
            priority: void 0
          });
          console.log(outhash);
          self.getBlock(outhash,function(out) {
            callback(out);
          });
          });
        });


      });

  },
  genBlock: function(cod, approvedSemester, approvedPrepractica, creator, callback) {
    var self = this;
    GenCertificate.setProvider(self.web3.currentProvider);
    var MyContract = self.web3.eth.contract(GenCertificate._json.abi);
    console.log(cod+" ----------------------------- "+ creator);

    var myContractInstance = MyContract.at('0x364d23421881d98841f706e728c939469c1309f6');
     //''

    var getData = myContractInstance.genBlock.getData(cod, approvedSemester, approvedPrepractica);

    var nonce = self.web3.toHex(self.web3.eth.getTransactionCount(creator));
    var gasPrice = self.web3.toHex(self.web3.eth.gasPrice);
    var gasLimitHex = self.web3.toHex(2000000);
    var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': creator, 'to':'0x364d23421881d98841f706e728c939469c1309f6', 'data': getData};

    var tx = new Tx(rawTx);
    tx.sign(privateKey);

    var serializedTx = '0x'+tx.serialize().toString('hex');

    self.web3.eth.sendRawTransaction(serializedTx, function(err, txHash){
      console.log(err, txHash);
      self.getTransactionReceiptMined(txHash).then(function(receipt) {
        console.log("receipt");
        console.log(receipt);
        self.getBlock(cod,function(out) {
          callback(out);
        });
      });
    });

  },
  genActa: function(codeStudent, day, month, cod, creator, callback) {
    var self = this;
    GenCertificate.setProvider(self.web3.currentProvider);
    var MyContract = self.web3.eth.contract(GenCertificate._json.abi);
    console.log(cod+" ----------------------------- "+ creator);

    var myContractInstance = MyContract.at('0x364d23421881d98841f706e728c939469c1309f6');
     //''
    var resultHash;
    myContractInstance.genActa.call(codeStudent, day, month, cod,function(err, result) {

      console.log("resultado");
      console.log(result);
      console.log('_____________________________________________________________________');
      resultHash = result;
      var getData = myContractInstance.genActa.getData(codeStudent, day, month, cod);

      var nonce = self.web3.toHex(self.web3.eth.getTransactionCount(creator));
      var gasPrice = self.web3.toHex(self.web3.eth.gasPrice);
      var gasLimitHex = self.web3.toHex(2000000);
      var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': creator, 'to':'0x364d23421881d98841f706e728c939469c1309f6', 'data': getData};

      var tx = new Tx(rawTx);
      tx.sign(privateKey);

      var serializedTx = '0x'+tx.serialize().toString('hex');
      //console.log("resultado");
      //console.log(result[0]+"ººººººººººººººººººººººººººººº");
if (result === null) {
  callback(["0x0000000000000000000000000000000000000000000000000000000000000000","No puede graduarce"]);
}else if (result[0] !== '0x0000000000000000000000000000000000000000000000000000000000000000' ) {
        self.web3.eth.sendRawTransaction(serializedTx, function(err, txHash){
          console.log(err, txHash);
          self.getTransactionReceiptMined(txHash).then(function(receipt) {
             callback(result);
          });
        });
      }else {
        callback(result);
      }
    });
  },
  getBlock: function(cod, callback) {

    var self = this;
    GenCertificate.setProvider(self.web3.currentProvider);
    var MyContract = self.web3.eth.contract(GenCertificate._json.abi);
    console.log(cod+"----------------------------- ");
    //console.log(GenCertificate._json.abi);
    var myContractInstance = MyContract.at('0x364d23421881d98841f706e728c939469c1309f6'); //''

    myContractInstance.getBlock.call(cod,function(err,result) {
      console.log(result+"+++++++++++++++++++++++++++++++++++++++++++");
      callback(result);
    });
  },
  getCertificate: function(hashCode,callback) {

    var self = this;
    GenCertificate.setProvider(self.web3.currentProvider);
    var MyContract = self.web3.eth.contract(GenCertificate._json.abi);
    //console.log(GenCertificate._json.abi);
    var myContractInstance = MyContract.at('0x364d23421881d98841f706e728c939469c1309f6'); //''

    myContractInstance.getCertificate.call(hashCode,function(err,result1) {
      console.log(result1+"+++++++++++++++++++++++++++++++++++++++++++");
      myContractInstance.getCertificateBlock.call(hashCode,function(err,result2) {
        callback([result1,result2]);
      });
    });

  },
  getTransactionReceiptMined(txHash, interval) {
      const self = this;
      const transactionReceiptAsync = function(resolve, reject) {
          self.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
              if (error) {
                  reject(error);
              } else if (receipt == null) {
                  setTimeout(
                      () => transactionReceiptAsync(resolve, reject),
                      interval ? interval : 500);
              } else {
                  resolve(receipt);
              }
          });
      };

      if (Array.isArray(txHash)) {
          return Promise.all(txHash.map(
              oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
      } else if (typeof txHash === "string") {
          return new Promise(transactionReceiptAsync);
      } else {
          throw new Error("Invalid Type: " + txHash);
      }
    }
}
