/*
I seek to generate ethereum address using the following tools
1.) Generate random mnemonic phrase using BIP39 package.
2.) Use the Mnemonic phrase genrated above to generate seed.(BIP39 Package)
3.) Use the seed gotten above to generate a private key.
4.) Use ethereumjs-wallet/hdkey' to generate the private key.
5.) Use the private key above to generate the public key.(ethereumjs-wallet).
6.) With the public key use ('js-sha3').keccak256 to derive ethereum address.
*/
const bip39 = require('bip39');//Module to generate random mnemonic.
const hdkey = require('ethereumjs-wallet/hdkey');//Module to generate keys.
const ethereumjs= require('ethereumjs-wallet');//Module to generate address from the keys provided.
const keccak256 = require('js-sha3').keccak256;//Module to derive the address.

//Create a secure module to create address in Ethereum using WeakMap
var ethereumAddress = (function(){
  //A new weak map object to store the ethereum account details.
  //This provides the privacy needed from bad actors.
  var ethAccounts = new WeakMap();

  function ethereumAddress(email){
    //This function creates the mnemonic words.
    //Also acts as the entry point.
    ethAccounts.set(this,{email:email});
    return generateMnemonic();
  };

  //This generates a mnemonic phrase
  function generateMnemonic(){
    const mnemonic = bip39.generateMnemonic();
    ethAccounts.set(this,{mnemonic:mnemonic});
    return generateSeedPhrase(mnemonic);
  };

  //Generate seed from mnemonic.
  function generateSeedPhrase(mnemonic){
    const seed =  bip39.mnemonicToSeed(mnemonic);
    ethAccounts.set(this,{seed:seed});
    return generatePrivateKey(mnemonic);
  };

  //Generate the private key from the seed
  function generatePrivateKey(mnemonic){
    const seed = ethAccounts.get(this).seed; //generateSeedPhrase(mnemonic);
    const privateKey = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`).getWallet().getPrivateKey();
    ethAccounts.set(this,{privateKey:privateKey});
    return generatePublicKey(ethAccounts.get(this).privateKey);
  };

  //Generate public key from the private keys
  function generatePublicKey(privateKey){
    const wallet = ethereumjs.fromPrivateKey(privateKey);
    const pubKey =  wallet.getPublicKey();
    ethAccounts.set(this,{pubKey:pubKey});
    return deriveEthAddress(ethAccounts.get(this).pubKey);
  };

  //Derive the Ethereum adress
  function deriveEthAddress(publicKey){
    const address = keccak256(publicKey);//This gets the hash of the publicKey
    //Get the last 20 bytes of the public key this is the address.
    ethAccounts.set(this,{address:address});
    return address;
  };

  ethereumAddress.prototype.getAddress = function(){
    return ethAccounts.get(this).address;;
  };
  return ethereumAddress;

}());
module.exports = ethereumAddress;
//module.exports = ethereumAddress('opopp@ioioioio.com')//Testing purposes.
