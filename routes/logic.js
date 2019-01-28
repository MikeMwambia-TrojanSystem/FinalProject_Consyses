var validObj =  require('./data.js');
exports.methodName = function(req,res,next){
	var methodNamed = req.query.method
	switch(methodNamed){
		case  'createArticleJson' :
		return validObj.validObj.createUserData(req,res,next);
		next();
		break;
		case 'readArticleDetails':
		return validObj.validObj.readArticleDetails(req,res,next);
		next();
		break;
	}
}
