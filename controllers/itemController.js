var express = require('express');
var router = express.Router();

module.exports = exports = function (ItemModel) {

	exports.postItems = function (req, res) {
		var item = new ItemModel();

		item.name = req.body.name;
		item.type = req.body.type;
		item.quantity = 0 || req.body.quantity;

		if (typeof req.body.name != 'undefined' && req.body.type != 'undefined') {
			item.save(function (err) {
				if (err) {
					res.status(500);
					res.send(err);
				}
				res.json({
					message: 'Item added to the locker!',
					data: item
				});

				console.log('Item added to the locker!');
			});
		} else {
			res.json({
				message: 'no item to add?!'
			});
		}
	};

	exports.getItems = function (req, res) {
		console.log(req.path, '=> exports.getItems');

		ItemModel.find(function (err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	};

	//var itemRoute = router.route('/items/:item_id');
	exports.getItem = function (req, res) {
		ItemModel.findById(req.params.item_id, function (err, item) {
			if (err)
				res.send(err);

			res.json(item);
		});
	};

	exports.putItem = function (req, res) {
		ItemModel.findById(req.params.item_id, function (err, item) {
			if (err)
				res.send(err);

			item.quantity = req.body.quantity;

			item.save(function (err) {
				if (err)
					res.send(err);

				res.json(item);
			});
		});
	};

	exports.deleteItem = function (req, res) {
		ItemModel.findById(req.params.item_id, function (err, item) {
			if (err)
				res.send(err);

			item.quantity = Math.max(item.quantity - 1, 0);
			item.save(function (err) {
				if (err)
					res.send(err);

				res.json(item);
			});
		});
	};

	return exports;
}