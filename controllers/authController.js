var express = require('express');
var uuid = require('node-uuid');

var router = express.Router();

module.exports = exports = function (UserModel, TokenModel) {

	exports.login = function (req, res) {
		console.log(req.path, '=> exports.login');
		var userId = req.user.preferredIdentity;

		// Create new token
		var newToken = uuid.v4();
		var validDate = new Date();
		validDate.setTime(validDate.getTime() + (24 * 60 * 1000 * 60));

		// Update token for the user
		TokenModel.findOneAndUpdate({
			//query
			userId: userId
		}, {
			//updated document
			value: newToken,
			date: validDate
		}, {
			//options
			upsert: true
		}, function (err, update, callback) {
			if (err)
				console.log(err);

			res.json({
				token: newToken,
				valid: validDate,
				user: userId //req.user
			});
		});
	};

	exports.notAuthenticated = function (req, res) {
		res.status(403).json({
			message: 'not authenticated...'
		});
	};

	exports.refreshToken = function (req, res) {
		var reqToken = req.body.token;
		var reqUser = req.body.username;
		if (typeof reqToken !== 'undefined' && reqToken !== null && typeof reqUser !== 'undefined' && reqUser !== null) {
			TokenModel.findOne({
				value: reqToken
			}, function (err, token) {
				if (err)
					res.json(err);

				if (token) {
					var now = new Date();
					if (token.date > now) {

						var validDate = new Date();
						validDate.setTime(validDate.getTime() + (24 * 60 * 1000 * 60));

						token.date = validDate;
						token.save(function (err) {
							if (err)
								res.json(err);

							res.json({
								message: 'token found, date extended',
								token: token
							});
						});

					} else {
						res.json({
							message: 'token found, expired',
							token: token
						});
					}
				} else {
					res.status(401).json({
						message: 'token not found'
					});

				}
			});

		} else {
			res.status(500).json({
				message: 'token/username is undefined or null'
			});
		}

	};

	return exports;
};