var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	roles: {
		type: Array,
		required: false,
		default: null
	}
});

UserSchema.pre('save', function (callback) {
	var user = this;

	if (!user.isModified('password')) return callback();

	bcrypt.genSalt(5, function (err, salt) {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserSchema.methods.verifyPassword = function (password, cb) {
	console.log('Password sent to verify:', password);

	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) return cb(err);
		console.log('Verify result:', isMatch);
		cb(null, isMatch);
	});
};

UserSchema.methods.getRoles = function () {
	console.log('Getting roles for user:', this.username);

	return this['roles'];
};

UserSchema.methods.isInRole = function (requiredRoles, cb) {
	var userRoles = this.roles;

	for (var i = 0; i < requiredRoles.length; i++) {
		for (var z = 0; z < userRoles.length; z++) {
			if (requiredRoles[i] === userRoles[z]) {
				return cb(true);
			}
		}
	}

	return cb(false);
}

module.exports = mongoose.model('User', UserSchema);