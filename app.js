var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var passport = require('passport');

var port = process.env.PORT || 8080;
var ip = process.env.IP;
var dbURI = 'mongodb://'+ip+'/itemlocker'

mongoose.connect(dbURI);

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use('/api', router);

app.listen(port);
console.log('Insert item on port ' + port);