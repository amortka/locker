var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = require('./routes');
var passport = require('passport');


// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Register all our routes with /api

app.use(passport.initialize());

app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert beer on port ' + port);