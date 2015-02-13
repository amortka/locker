module.exports = exports = function (UserModel) {

	exports.postUsers = function (req, res) {
		var user = new UserModel({
			username: req.body.username,
			password: req.body.password
		});
		user.save(function (err) {
			if (err)
				res.send(err);

			res.json({
				message: 'New beer drinker added to the locker room!'
			});
		});
	};

	exports.getUsers = function (req, res) {
		UserModel.find(function (err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	};

	exports.verify = function (req, res) {
		console.log('trying to verify password for:', req.body.username);
		UserModel.findOne({
			username: req.body.username
		}, function (err, user) {
			if (err) {
				res.status(500).json({
					message: 'Server error'
				});
				return;
			}

			if (!user) {
				res.status(401).json({
					message: 'user not found!'
				});
				return;
			}

			user.verifyPassword(req.body.password, function (err, isMatch) {
				if (err)
					res.status(500).json({
						message: 'Server error'
					});

				if (isMatch)
					res.json({
						message: 'Authenticated!'
					});
				else
					res.status(401).json({
						message: 'Wrong password'
					});
			});

		});
	}

	return exports;
}