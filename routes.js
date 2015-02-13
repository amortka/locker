var express = require('express');

var BeerModel = require('./models/beerModel');
var TokenModel = require('./models/tokenModel');
var UserModel = require('./models/userModel');

var authController = require('./controllers/authController')(UserModel, TokenModel);
var beerController = require('./controllers/beerController')(BeerModel);
var userController = require('./controllers/userController')(UserModel);

var authService = require('./services/authService.js')(UserModel, TokenModel);

var router = express.Router();

router.get('/', function (req, res) {
	res.json({
		message: 'You are running dangerously low on beer!'
	});
});

//* ---- Beers ---- ----  *//
router.route('/beers')
	.post(authService.isTokenValid, authService.isInRole('admin'), beerController.postBeers)
	.get(authService.isTokenValid, authService.isInRole('user'), beerController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
	.get(authService.isTokenValid, beerController.getBeer)
	.put(authService.isTokenValid, beerController.putBeer)
	.delete(authService.isTokenValid, beerController.deleteBeer);

//* ---- Users ---- ----  *//
router.route('/users')
	.post(userController.postUsers)
	.get(userController.getUsers);

router.route('/users/verify')
	.post(userController.verify);

//* ---- Authentication ----  *//
router.route('/auth')
	.post(authService.isAuthenticated, authController.login);
router.route('/refreshToken')
	.post(authController.refreshToken);
router.route('/notAuthenticated')
	.get(authController.notAuthenticated);

module.exports = router;