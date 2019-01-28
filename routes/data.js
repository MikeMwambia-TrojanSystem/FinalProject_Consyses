	var ProjectPath = require('../app.js');
	var ethereumAddress = require('../generateEthAddress.js');
	const fs = require('fs-extra');
	var path = require('path');
	var validObj = {
	articleDoc : {},
	createUserData : function(req,res){
	var docbody  = req.body;
	var docOwnermail = docbody.email;
	var signatoriesArray = docbody.signatories.split(',');
	if(signatoriesArray.length>0){
		this.createAddreses(req.body);
		res.send('Succes');
	}else{
		res.send('Invalid signatories');
	};
	},
	createAddreses:function(docObj){
		var docDetails = docObj;
		var signatoriesArray = docObj.signatories.split(',');
		if(signatoriesArray.length>0){
		var signatoryAddresses = [];
		var signatoryObj = {};
		for(var i=0;i<signatoriesArray.length;i++){
			if(this.validateMail(signatoriesArray[i])){
				signatoryObj.address = ethereumAddress(docDetails.signatories[i]);
				signatoryObj.emailAddress = signatoriesArray[i];
				//signatoryObj.privateKey = ethereumAddress.privateKey
			}else{
				signatoryObj.address = 'Invalid email given';
				signatoryObj.emailAddress = signatoriesArray[i];
				//signatoryObj.privateKey = 'Invalid email given';
			}
		signatoryAddresses.push(signatoryObj);
		console.log(signatoryObj.address);
		if(i==signatoriesArray.length-1){
		docDetails.signatoryAddresses = signatoryAddresses;
		this.createDocJson(docDetails);
		}
		}
		}
	},
	validateMail : function(value){
	var message;
	if(typeof(value)=== "string") {
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

createDocJson:function(articleObj){
var namehint = ''+articleObj.email.substring(0,articleObj.email.indexOf('@'));
var docFolder = path.join(ProjectPath.ProjectPath,namehint);
fs.ensureDir(docFolder).then(()=>{
fs.writeJson(path.join(docFolder,namehint+'.json'),{docOwner:articleObj},function(err,file){
if(err){
console.log(err);
}else{
console.log('success');
};
})
})
},
readArticleDetails:function(req,res){
var email = req.body.email;
var namehint = ''+email.substring(0,email.indexOf('@'));
var docFolder = path.join(ProjectPath.ProjectPath,namehint);
fs.ensureDir(docFolder).then(()=>{
fs.readJson(path.join(docFolder,namehint+'.json'),function(err,fileObj){
if(err){
console.log(err);
res.send(err);
}else{
console.log('success');
res.send(fileObj);
};
});
});
},
uniqueCharacters:function uniq(a){
var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
return a.filter(function(item) {
var type = typeof item;
if(type in prims)
return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
else
return objs.indexOf(item) >= 0 ? false : objs.push(item);
});
}
}
exports.validObj = validObj;
