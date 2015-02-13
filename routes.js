var express = require('express');

var ItemModel = require('./models/itemModel');
var TokenModel = require('./models/tokenModel');
var UserModel = require('./models/userModel');

var authController = require('./controllers/authController')(UserModel, TokenModel);
var itemController = require('./controllers/itemController')(ItemModel);
var userController = require('./controllers/userController')(UserModel);

var authService = require('./services/authService.js')(UserModel, TokenModel);

var router = express.Router();

router.get('/', function (req, res) {
	res.json({
		message: 'You are running dangerously low on item!'
	});
});

//* ---- Items ---- ----  *//
router.route('/items')
	.post(authService.isTokenValid, authService.isInRole('admin'), itemController.postItems)
	.get(authService.isTokenValid, authService.isInRole('user'), itemController.getItems);

// Create endpoint handlers for /items/:item_id
router.route('/items/:item_id')
	.get(authService.isTokenValid, itemController.getItem)
	.put(authService.isTokenValid, itemController.putItem)
	.delete(authService.isTokenValid, itemController.deleteItem);

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