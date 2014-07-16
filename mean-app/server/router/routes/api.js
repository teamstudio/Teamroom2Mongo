//process all request for the API

var express		= require('express');
var router 		= express.Router();
var Item 		= require('../../models/item');
var Metadata 	= require('../../models/metadata');
var Members		= require('../../models/member');
var Grid 		= require('../../models/grid');
var mongoose	= require('mongoose');
//var GridStore 	= require('mongodb').GridStore;
//var Grid 		= require('mongodb').Grid;


router.use( function(req,res,next) {

	//console.log("req coming in...");
	next();

});

router.get('/', function(req, res, next) {
  res.json({msg : 'ok !'});
});

router.route('/metadata')

	//retrieve all metadata
	.get( function(req, res) {

		Metadata.findOne( {}, function(err, items) {
			if (err) {
				res.send(err);
			}

			res.json(items);
		});

	});

router.route('/items')

	//retrieve all items
	.get( function(req, res) {

		Item.find( function(err, items) {
			if (err) {
				res.send(err);
			}

			res.json(items);
		});

	})

	//create a document with a title and contents
	.post( function(req, res) {

		console.log(req.body.title);

		var it = new Item();
		it.title = req.body.title;
		it.contents = req.body.contents;

		it.save( function(err) {
			if (err) {
				res.send(err);
			}

			res.json( { message : 'item created with title '  + req.body.title } );

		});


	});

router.route('/items/:item_id')

	//retrieve a specific item
	.get( function(req, res) {

		Item.findById( req.params.item_id, function(err, item) { 

			if (err)
				res.send(err);

			res.json(item);
		});

	})

	//update an item
	.put( function(req, res) {

		console.log(' got a put for ' + req.params.item_id );
		console.log(" with" + req.body.title);

		Item.findById( req.params.item_id, function(err, item) {

			if (err)
				res.send(err);

			item.title = req.body.title;
			item.contents = req.body.contents;

			item.save( function(err) {
				if (err)
					res.send(err);

				res.json( { message : 'item is updated'});
			});

		});

	})

	//delete an item
	.delete(function(req, res) {
		Item.remove({
			_id: req.params.item_id
		}, function(err, item) {
			if (err)
				res.send(err);

			res.json({ message: 'item is deleted' });
		});
	});

router.route('/items/:item_id/files')

	//get files for parent id
	.get( function(req, res) {

		//query mongo GridFS for file

		var parentId = req.params.item_id;

		console.log("> get files for parentId: " + parentId);
		
		Grid.find( { "metadata.parentId" : parentId }, function(err, gridfiles) {

		  if (err) throw err;
		  res.json( gridfiles);

		});
	
	});


module.exports = router;