var frontLogic = {
  //Check user session
  userDetails:{},
  web3Provider: null,
  contracts:{},
  articleDetails:{},
  //Starts web3 on the browser.
  startWeb3: async function() {
  //Start Web3 environment on browser.
  if(window.ethereum) {
    frontLogic.web3Provider = window.ethereum;
    try {
      //Request account access
      await window.ethereum.enable();
    }catch(error){
      //User denied account access
      alert("User denied account access");
      console.error();("User denied account access");
    }
    //Legacy dapp browsers...
  }else if(window.web3) {
    frontLogic.web3Provider = window.web3.currentProvider;
  }
  //If no injected web3 instance is detected , fall back to Ganache
  else {
    //This is the ganache private block chain.
    frontLogic.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
  }
  return frontLogic.initializeContract();
  },
  //Initializes the contract.
  initializeContract:function() {
  $.getJSON('Signers.json',function(data){
  //Get the necessary contract artifact file and instantiate it with
  //truffle-contract method.
  var signersArtifacts = data;
  frontLogic.contracts.Signers = TruffleContract(signersArtifacts);
  //Set the provider for our contracts
  frontLogic.contracts.Signers.setProvider(frontLogic.web3Provider);
  });
  },
  //Uploads the document to the contract storage.
  addAddressessToDoc:function(){
  var intRequiredSignatories = sessionStorage.getItem('signatoriesLength');
  console.log(intRequiredSignatories);
  var account = sessionStorage.getItem('ownerAddress');
	var contentHash = sessionStorage.getItem('contentHash');
  web3.eth.getAccounts(function(error,accounts){
  if(error){
    console.log(error);
  }else{
    console.log(accounts);
    var account = accounts[0];
	  frontLogic.contracts.Signers.deployed().then(function(instance){
      //To address changes depending on the address you use on deployment.
      frontLogic.contracts.Signers.address = instance.address;
		  return instance.addDoc(contentHash,intRequiredSignatories,{from:account});
	  }).then(function(result){
      var response = result;
      var transactionhash = response.receipt.transactionHash;
      document.getElementById('one').style.display = 'none';
      document.getElementById('four').style.display = '';
      document.getElementById('documentTitleHash1').innerText = sessionStorage.getItem('contentTitle');
      document.getElementById('documentContentHash1').innerText = sessionStorage.getItem('contentHash');
      document.getElementById('smartcontractAddress').innerText = frontLogic.contracts.Signers.address;
      //This are the results from the document that has been saved in the contract
      document.getElementById('transactionhash').innerText = transactionhash;
      document.getElementById('ownerAddress').innerText = account;
	  }).catch(function(err){
		  console.log(err.message);
	  })
  }
});
},
//Check whether the user has uploaded the document before.
//By checking the JSON on server.
  checkUserSession:function (){
    var mailSession = sessionStorage.getItem('email');
    console.log(mailSession);
    if(null == mailSession){
      this.startWeb3();
      document.getElementById("one").style.display = "none";
      document.getElementById("two").style.display = "none";
      document.getElementById("three").style.display = "none";
    }else{
      //Run logic of the user.
      var email = sessionStorage.getItem('email');
      frontLogic.receiveFromServer(email);
    }
  },

  //Sign Up
  signUpUser : function (){
    var email = document.getElementById("docOwner").value;
    if(!this.dataAuthentication(email)){
      alert("Enter a valid email address to proceed");
    }else{
      //Set session
      sessionStorage.setItem('email',email);
      this.userDetails.email = email;
      document.getElementById("three").style.display = "";
      document.getElementById("etheAddress").innerText = web3.eth.accounts[0];
      document.getElementById("emailAddress").innerText = email;
      document.getElementById("emailAddress1").innerText = email;
      document.getElementById("one").style.display = "none";
      document.getElementById("intro").style.display = "none";
      document.getElementById("two").style.display = "none";
	  document.getElementById('AddSignatories').style.display = 'none';
      return false;
    }
  },
  //Add signatories and documents
  addArticle:function (){
    var articleContent = document.getElementById("message").value;
    var title = document.getElementById("name").value;
    if(title==""){
      alert('Title cannot be blank');
    }else if(articleContent==""||articleContent.length>300){
      alert("Title needs to be less than 300 and not blank");
    }else{
    var email = sessionStorage.getItem('email');
	document.getElementById("two").style.display = "";
	document.getElementById("title").innerText = title;
	document.getElementById("content").innerText = articleContent;
    document.getElementById("etheAddress").innerText = web3.eth.accounts[0];
    document.getElementById("emailAddress").innerText = email;
    document.getElementById("emailAddress1").innerText = email;
    document.getElementById("one").style.display = "none";
    document.getElementById("intro").style.display = "none";
	document.getElementById("three").style.display = "none";
    sessionStorage.setItem('articleContent',articleContent);
    sessionStorage.setItem('title',title);
    this.signArticle();
    }
  },
  //Add Signatories
  addSignatoriesToDoc:function(){
    document.getElementById('two').style.display = 'none';
    document.getElementById('one').style.display = ''
    document.getElementById("emailAddress3").innerText = sessionStorage.getItem('email');
  },
  checkSignatories:function(){
    var signatories = [];
    for(var a=1;a<11;a++){
      var elementDoc = document.getElementById('signatory'+a);
      if(elementDoc){
      var signatoryMail = elementDoc.value;
      if(!this.dataAuthentication(signatoryMail)){
        alert("Signatory email "+a+" is not valid");
      }else{
        signatories.push(signatoryMail);
      }
      if(a==10){
        var ownerMail = sessionStorage.getItem('email')
        signatories.push(ownerMail);
        sessionStorage.setItem('signatories',signatories);
        this.sendToServer('signatories');
      }
      }
    }
  },
  signArticle:function (){
    var contentHash = web3.sha3(sessionStorage.getItem('articleContent'));
    var contentTitle = web3.sha3(sessionStorage.getItem('title'));
    sessionStorage.setItem('contentHash',contentHash);
    sessionStorage.setItem('contentTitle',contentTitle);
	 document.getElementById('documentTitleHash').innerText = contentTitle;
	 document.getElementById('documentContentHash').innerHTML = contentHash;
    document.getElementById('two').style.display = '';
    document.getElementById('emailAddress').innerText = sessionStorage.getItem('email');
  },
  dataAuthentication:function(value){
        if(typeof(value=== "string")) {
            var emailFilter = /(.+)@(.+){2,}\.(.+){2,}/;
            var pass = emailFilter.test(value);
            if(!pass){
                message = false;
                return message;
            }else{
                message = true;
                return message;
            }
        }else{
            message = false;
            return message;
        }
  },
  //Create a JSON file about the article for reference.
  sendToServer:function(value){
  var articleDoc = {};
	articleDoc.email = sessionStorage.getItem('email');
	articleDoc.articleContent = sessionStorage.getItem('articleContent');
	articleDoc.title = sessionStorage.getItem('title');
	articleDoc.contentTitle = sessionStorage.getItem('contentTitle');
	articleDoc.contentHash  = sessionStorage.getItem('contentHash');
	articleDoc.signatories = sessionStorage.getItem('signatories');
	if(value =='signatories'){
		$.post('/purchase?method=createArticleJson',{email:articleDoc.email,articleContent:articleDoc.articleContent,title:articleDoc.title,
      contentTitle:articleDoc.contentTitle,contentHash:articleDoc.contentHash,signatories:articleDoc.signatories},function(data){
			//This are the returned eth adresses.
      if(data ==='Succes'){
        frontLogic.receiveFromServer();
      }else{
        alert('An error occured refresh page and try again');
      }
		});
	}
  },
  //Queries the server about the existing JSON file.
  receiveFromServer:function(){
    var email = sessionStorage.getItem('email');
    $.post('/purchase?method=readArticleDetails',{email:email},function(data){
      //This are the returned eth adresses.
	  sessionStorage.setItem('articleDetails',data);
	  var addressArray = data.docOwner.signatoryAddresses;
	  sessionStorage.setItem('signatoriesLength',addressArray.length);
	  for(var a=0;a<addressArray.length;a++){
	  var elInt = a+1
	  var emailAddress10 = document.getElementById('emailAddress'+elInt);
	  var emailInputEl = document.getElementById('signatory'+elInt);
	  var emailAddrEl =  document.getElementById('signatory'+elInt+'Address');
      if(emailAddress10){
		emailInputEl.style.display = 'none';
		emailAddress10.innerText = addressArray[a].emailAddress;
		emailAddrEl.innerText = addressArray[a].address;
      }
    }
	document.getElementById('notify').innerText = 'The following address were generated';
	document.getElementById('AddSignatories').style.display = '';
	document.getElementById('generateAddress').style.display = 'none';
    });
  }
}
frontLogic.checkUserSession();
