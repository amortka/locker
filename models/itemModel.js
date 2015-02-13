var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
	name: String,
	type: String,
	quantity: Number
});

module.exports = mongoose.model('Item', ItemSchema);