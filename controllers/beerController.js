var express = require('express');
var router = express.Router();

module.exports = exports = function (BeerModel) {

	exports.postBeers = function (req, res) {
		var beer = new BeerModel();

		beer.name = req.body.name;
		beer.type = req.body.type;
		beer.quantity = 0 || req.body.quantity;

		if (typeof req.body.name != 'undefined' && req.body.type != 'undefined') {
			beer.save(function (err) {
				if (err) {
					res.status(500);
					res.send(err);
				}
				res.json({
					message: 'Beer added to the locker!',
					data: beer
				});

				console.log('Beer added to the locker!');
			});
		} else {
			res.json({
				message: 'no beer to add?!'
			});
		}
	};

	exports.getBeers = function (req, res) {
		console.log(req.path, '=> exports.getBeers');

		BeerModel.find(function (err, beers) {
			if (err)
				res.send(err);

			res.json(beers);
		});
	};

	//var beerRoute = router.route('/beers/:beer_id');
	exports.getBeer = function (req, res) {
		BeerModel.findById(req.params.beer_id, function (err, beer) {
			if (err)
				res.send(err);

			res.json(beer);
		});
	};

	exports.putBeer = function (req, res) {
		BeerModel.findById(req.params.beer_id, function (err, beer) {
			if (err)
				res.send(err);

			beer.quantity = req.body.quantity;

			beer.save(function (err) {
				if (err)
					res.send(err);

				res.json(beer);
			});
		});
	};

	exports.deleteBeer = function (req, res) {
		BeerModel.findById(req.params.beer_id, function (err, beer) {
			if (err)
				res.send(err);

			beer.quantity = Math.max(beer.quantity - 1, 0);
			beer.save(function (err) {
				if (err)
					res.send(err);

				res.json(beer);
			});
		});
	};

	return exports;
}