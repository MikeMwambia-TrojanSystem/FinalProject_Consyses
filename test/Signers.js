var Signers = artifacts.require("./signers.sol");
contract('Signers',(accounts)=>{
  const docOwner = accounts[0];
  const docHash = "docHash";
  const signatoryAddress = accounts[1];

//This test checks whether a document structs is sucessfully added.
  it('Should add doc and compare dochash',function(){
    Signers.deployed().then(function(instance){
    return instance.addDoc(docHash,5);
  }).then(function(){
    var docHashReturn = instance.verifyDoc(docOwner);
    assert.equal(docHashReturn,docHash,"They are equal");
  });
});

//This test checks whether a signatory in this case address[1] is successfully added.
it('Should add signatory address',function(){
  Signers.deployed().then(function(instance){
    return instance.addSigner(signatoryAddress,docHash,docOwner);
  }).then(function(){
    var signatory = instance.signStructs[signatoryAddress];
    assert.equal(docOwner,signatory.docOwnerAddress,"They are same address");
  })
});

//This checks whether the approval flag from the document structs stored on the block chain.
 it('Should remove approval from document',function(){
   Signers.deployed().then(function(instance){
     return instance.addSigner(signatoryAddress,docHash,docOwner);
  }).then(function(instance){
     instance.removeApproval();
  }).then(function(){
    var valueSignatory = instance.docs[docOwner];
    assert.equal(valueSignatory.needApproval,false,"Approval flag removed");
    })
 });

//This test whether the document is signed by checking the flag of the signatory.
 it('Should Sign document',function(){
   Signers.deployed().then(function(instance){
     return instance.sign(docOwner);
   }).then(function(instance){
     var signed = instance.signStructs[docOwner].signed
     assert.equal(signed,true,"Document is signed");
   })
 });

//This changes the ownership of the contract to the address of the signatory.
 it('Should change ownership of Contract',function(){
   Signers.deployed().then(function(instance){
     return instance.changeOwnership(signatoryAddress,docOwner);
   }).then(function(){
     assert.equal(docs[signatoryAddress].docOwnerAddress,signatoryAddress,"Owner Changed to Singatory");
   })
 });

});
