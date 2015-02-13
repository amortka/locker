var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LdapStrategy = require('passport-ldapauth');
var LocalStrategy = require('passport-local');
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = exports = function (UserModel, TokenModel) {

	/* BASIC strategy, based on mongoDB */
	passport.use(new BasicStrategy(
		function (username, password, callback) {
			UserModel.findOne({
				username: username
			}, function (err, user) {
				if (err) {
					return callback(err);
				}
				// No user found with that username
				if (!user) {
					return callback(null, false);
				}
				// Make sure the password is correct
				user.verifyPassword(password, function (err, isMatch) {
					if (err) {
						return callback(err);
					}
					// Password did not match
					if (!isMatch) {
						return callback(null, false);
					}
					// Success
					return callback(null, user);
				});
			});
		}
	));

	/* LOCAL strategy, not used... */
	passport.use(new LocalStrategy(
		function (username, password, callback) {
			if (username === 'adam' && password === '123')
				return callback(null, true);
			else
				return callback(null, false);
		}
	));

	/*LDAP strategy */
	var OPTS = {
		server: {
			url: 'ldap://bluepages.ibm.com:389',
			searchBase: 'ou=bluepages,o=ibm.com',
			searchFilter: '(mail={{username}})'
		}
	};
	//	passport.use(new LdapStrategy(OPTS));
	passport.use(new LdapStrategy(OPTS, function (userLdap, done) {
		console.log('callback for auth with LdapStrategy');

		var userId = userLdap.preferredIdentity;
		UserModel.findOne({
			username: userId
		}, function (err, user) {
			if (err)
				done(null, false);

			done(null, userLdap, {
				access: '*'
			});
		});
	}));

	/*BEARER strategy */
	passport.use(new BearerStrategy(
		function (accessToken, callback) {
			console.log('callback for auth with BearerStrategy');

			TokenModel.findOne({
				value: accessToken
			}, function (err, token) {
				if (err) {
					return callback(err);
				}
				// No token found
				if (!token) {
					return callback(null, false);
				}

				var isTokenValid = token.date > new Date();
				var tokenExpire = ~~ ((token.date - new Date()) / 1000);

				if (!isTokenValid)
					return callback(null, false);

				UserModel.findOne({
					username: token.userId
				}, function (err, user) {
					if (err) {
						return callback(err);
					}
					// No user found
					if (!user) {
						return callback(null, false);
					}
					// Simple example with no scope
					callback(null, user, {
						tokenExpire: tokenExpire,
						access: '*'
					});
				});
			});
		}
	));

	exports.isInRole = function (requiredRole) {
		return function (req, res, next) {
			var userRoles = req.user.roles;
			console.log('required role for', req.path, 'is', requiredRole);
			console.log('user roles:', userRoles);
			if (userRoles.indexOf(requiredRole) !== -1)
				next();
			else
				res.status(401).json({
					message: req.user.username + 'not authorized for role ' + requiredRole
				});
		}
	};

	exports.isAuthenticated = passport.authenticate('ldapauth', {
		session: false,
		failureRedirect: '/api/notAuthenticated'
	});

	exports.isTokenValid = passport.authenticate('bearer', {
		session: false,
		failureRedirect: '/api/notAuthenticated'
	});

	return exports;
}