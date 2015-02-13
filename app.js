var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var passport = require('passport');


mongoose.connect('mongodb://localhost:27017/itemlocker');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

var port = process.env.PORT || 3000;


app.use(passport.initialize());

app.use('/api', router);

app.listen(port);
console.log('Insert item on port ' + port);