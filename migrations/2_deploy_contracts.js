var signers = artifacts.require("./signers.sol");
module.exports = function (deployer,network,accounts){
  const superuser  = accounts[0];
  console.log('Deploying to network',network,'from',superuser);
  deployer.deploy(signers,{from:superuser}).then(()=>{
    console.log('Deployed Signers with address',signers.address);
  });
};
