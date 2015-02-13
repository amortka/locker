var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
	value: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('Token', TokenSchema);