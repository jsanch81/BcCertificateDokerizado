var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var DateTime = artifacts.require("./DateTime.sol");
var GenCertificate = artifacts.require("./GenCertificate.sol");
var Strings = artifacts.require("./Strings.sol");
var Dates1 = artifacts.require("./Dates1.sol");

module.exports = function(deployer) {
  deployer.deploy(DateTime);
  deployer.deploy(Strings);
  deployer.link(Strings,Dates1);
  deployer.deploy(Dates1);
  deployer.link(DateTime,GenCertificate);
  deployer.link(Strings,GenCertificate);
  deployer.link(Dates1,GenCertificate);
  deployer.deploy(GenCertificate);
};
