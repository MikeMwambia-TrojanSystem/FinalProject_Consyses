//REMEMBER TO RUN  npm install -g node-gyp before anything else and installing the packages
//Modules.
var fs = require('fs');
var http = require('http')
var path = require('path');
var favicon = require('express-favicon');
var serveStatic = require('serve-static');
var compression = require('compression');
var bodyParser = require('body-parser');
var express = require('express');
var helmet = require('helmet');
var logic = require('./routes/logic.js');
var ProjectPath = __dirname;
exports.ProjectPath = ProjectPath;
var app = express();
app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(compression());
app.use(express.static(__dirname+'/public'));

//Routes
app.get('/',function(req,res,next){
    res.sendFile(path.join(__dirname+'/public/index.html'));
    next();
});
//All post methods pass through here
app.all('/purchase',logic.methodName);

//Run Server
const port = 3000;
http.createServer(app).listen(port, (error) => {
    if (error) {
      logger.warn(error)
      return process.exit(1)
    } else {
        console.log("Running on "+port);
    }
});
