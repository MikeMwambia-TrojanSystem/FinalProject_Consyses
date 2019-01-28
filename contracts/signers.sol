pragma solidity ^0.5.0;

contract Signers {

  /*To store the signatory of the doc
  @dev save the every signatory in a different structs.
  @signatory address generated from the person mail
  @timestamp time when he was added as a signatory
  @docHash document docHash
  @docOwnerAddress address of the docOwner.
  @signed bool on whether he has signed a document.
  @removed bool on whether he has been removed as a signatory of a document.
  @authorised bool on whether he has been authorised to add more signatories.
  */
  struct signatories {
    address signatory;
    uint256 timestamp;
    string docHash;
	  address docOwnerAddress;
    bool signed;
    bool removed;
    bool authorised;
  }

  /*To store the signatory of the doc
  @dev save the every signatory in a different structs.
  @owner address of the owner.
  @timestamp time when he was added as a signatory
  @docHash document docHash
  @needApproval bool on whether the owner needs to approve signature.
  @pendingApproval signature that is pending approval.
  @requiredSignatures number of signatures needed on the doc equivalent to signatories.
  @signatures mapping of all the signatories of the document.
  */
  struct document {
    address owner;
    string docHash;
    bool needApproval;
	  address pendingApproval;
    uint requiredSignatures;
    mapping(address =>signatories) signatures;//Mapping to store the signatories structs in a document.
  }
  //To keep the state of the contract alive.
  bool isAlive = true;
  mapping(address => document) public docs;

  //Mapping of the address to the signatory structs.
  mapping (address => signatories) public signStructs;

  //Events when doc os signed.
  event signerSignd(string docHash,address signer);

  //Event when doc added
  event docAdded(string docHash,address owner);

  //Event when signer is added
  event signerAdded(address _address);

  //Event when signer is removed
  event signerRemoved(address _address,address _owner);

  //Document status Changed
  event documentSigned(string docHash);

  //Approve Event
  event approveSignature(address _address);

   //To ensure the addres is the owners
   modifier onlyOwner() {
     require(msg.sender == docs[msg.sender].owner);
     _;
   }

   //Only approved address

   modifier onlyAddress() {
     require(signStructs[msg.sender].authorised == true);
     _;
   }

  //Populate the document struct

  function addDoc(string memory _docHash,uint _requiredSignatures) public {
    require(_requiredSignatures>0);
    require(_requiredSignatures<12);
    require(isAlive = true);
    //Add doc Owner as signatory.
    signatories storage ownersignature = signStructs[msg.sender];
    ownersignature.signatory = msg.sender;
    ownersignature.timestamp = now;
    ownersignature.docHash = _docHash;
	  ownersignature.docOwnerAddress = msg.sender;
    ownersignature.signed = true;
    ownersignature.removed = false;
    ownersignature.authorised = true;
    emit signerAdded(msg.sender);

    //Set up doc.
    document storage currentDoc = docs[msg.sender];
    currentDoc.owner = msg.sender;
    currentDoc.docHash = _docHash;
    currentDoc.needApproval = true;
	  currentDoc.pendingApproval = msg.sender;//Default to sending pending as the address of the message sender.
    currentDoc.requiredSignatures = _requiredSignatures;
    currentDoc.signatures[msg.sender] = ownersignature;
    emit docAdded(_docHash,msg.sender);
  }

  //Adds the signatories to different documents.
  function addSigner(address _address,string memory _docHash,address _owner) public onlyOwner() onlyAddress() {
	  require(msg.sender != _address);
    signatories storage signatory = signStructs[_address];
    require(signatory.signatory != _address);
    document storage doc = docs[_owner];
	  signatory.signatory = _address;
    signatory.timestamp = now;
    signatory.docHash = _docHash;
	  signatory.docOwnerAddress = doc.owner;
    signatory.signed = false;
    signatory.removed = false;
    signatory.authorised = false;
    doc.signatures[_address]= signatory;
    emit signerAdded(_address);
  }

  //Sets the Doc into either ordered or not
  //Sets the doc on whether it needs approval or not
  function removeApproval() public onlyOwner() returns(bool) { //Only owner.
    document storage doc = docs[msg.sender];
	  require(doc.owner == msg.sender);
    doc.needApproval = false;
    return doc.needApproval;
  }

  //Removes the signers in the signatories.
   function removeSigners(address _address,address owner) public onlyOwner() returns(bool){ //Only owner or granted access
   signatories storage signature = signStructs[_address];
   require(signature.docOwnerAddress == owner);
   document storage doc = docs[owner];
   doc.requiredSignatures = doc.requiredSignatures-1;
   doc.signatures[_address].removed = true;
   emit signerRemoved(_address,owner);
   return doc.signatures[_address].removed;
   }

  //Grant address permission to add signers address.
  //@_address grants access to the address to add more signatories.
  function grantPermission(address _address) public onlyOwner() returns(bool){ //Only Owner of document only if the doc exists.
  signatories storage signatory = signStructs[_address];
  signatory.authorised = true;
  return true;
  }

//Returns the docHash of the document in storage
//@_owner is the address of the document owner.
  function verifyDoc(address _owner) public view returns(string memory){
  document memory doc =  docs[_owner];
  return doc.docHash;
  }

  //Change the structs part into signed making the document officially signed.
  //@owner is the address of the document owner.
  function sign (address owner) public returns(string memory){
  signatories storage signature = signStructs[msg.sender];
  document storage doc = docs[owner];
  require(signature.signed == false);
  require(signature.removed == false);
  require(signature.docOwnerAddress == owner);
  require(doc.requiredSignatures>0);
  require(doc.owner == owner);
  if(doc.needApproval == true){
	  if(doc.pendingApproval != signature.docOwnerAddress){
		  return 'pending approval';
	  }else{
		  signature.signed = true;
		  doc.pendingApproval = msg.sender;
      doc.requiredSignatures = doc.requiredSignatures-1;
      emit documentSigned(doc.docHash);
		  return 'signature accepted';
	  }
  }else{
		signature.signed = true;
    doc.requiredSignatures = doc.requiredSignatures-1;
    emit documentSigned(doc.docHash);
		return 'signature accepted';
  }
  }

  //Document owner approves signature on the contract.
  //@owner is the address of the document owner.
  function approveSignatureF(address owner) public onlyOwner() returns(address){
  document storage currentDoc = docs[owner];
  require(currentDoc.owner == msg.sender);
	require(currentDoc.pendingApproval != msg.sender);
	address _oldSignature = currentDoc.pendingApproval;
	currentDoc.pendingApproval = msg.sender;
  emit approveSignature(_oldSignature);
	return _oldSignature;
  }

  //Used to Kill the contract and remove it from the block chain.
  function kill() public onlyOwner() {
        isAlive = false;
        selfdestruct(msg.sender);
  }

  //Change Ownership.
  //@_owner is the address of the current document owner.
  //@_address is the address of the current document owner.
  function changeOwnership(address _address,address _owner) public onlyOwner() returns (address){ //Only owner
    document storage currentdoc = docs[_owner];
    currentdoc.owner = _address;
    return currentdoc.owner;
  }
}
