var Item		= require('./server/models/item.js');
var Member		= require('./server/models/member.js');
var Metadata	= require('./server/models/metadata.js');
var mongoose	= require('mongoose');
var request 	= require('request');
var config 		= require('./config/db');
var fs 			= require('fs');

module.exports = {

	processMetadata : function(metadata) {
		console.log('processing metadata for teamroom ' + metadata.name);

		Metadata.find( {}, function( err, mds)  {

			if (mds.length === 0 ) {

				var md = new Metadata();
				md.name = metadata.name;
				md.purpose = metadata.purpose;

				md.save( function(err, md) {
					if (err) console.error(err);
					console.log('> metadata stored in Mongo' );
				});

			}

		});

		for (var i=0; i<metadata.members.length; i++) {

			console.log("> process member: " + metadata.members[i].name);

			processMember( metadata.members[i] );

		}

	},

	

	processTeamroomDoc : function(doc, thisIdx, total) {

		console.log('processing "' + doc.title + '"');
		
		Item.find( { "sourceId" : doc.unid } , function(err, items ) {
			if (err) console.error(err);

			if (items.length === 0) {

				//create an item in Mongo
				it = new Item();
				it.author = doc.author;
				it.type = doc.type;
				it.title = doc.title;
				it.contents = doc.body;
				it.sourceId = doc.unid;

				it.save( function(err, it) {
					if (err) console.error(err);

					console.log('> item created '  + (thisIdx + '/' + total) + ', title "'  + it.title + '", id ' + it.id );

					//process files
					processFiles(it.id, doc.files);

				});

			} else {
				console.warn('item with source id '  + doc.unid + ' already imported' );
			}

		} );
	
	}


};

/*
 * This function will retrieve any attached files from the documents in Teamroom
 * and store them directly in Mongo's GridFS using the gridfs-stream plugin
 */
function processFiles(parentId, files) {

	for (var i=0; i<files.length; i++) {

		console.log('  - storing file: ' + files[i].name + ' with parentId ' + parentId);

		//open up a new writestream, store the parent document's id in the file metadata
		var writeStream = gfs.createWriteStream({
				filename : files[i].name,
				metadata : {
					'parentId' : parentId
				}
			});

		//retrieve the file from Teamroom and send it to Mongo
		request.get( {
			uri : 'https://' + config.dominoServerUrl + files[i].href,
			strictSSL : false 
		})
			.auth( config.user, config.password)
			.pipe( writeStream );

	}


}

function processMember(member) {

	Member.find( { "name" : member.name}, function(err, members) {

		if (members.length===0) {

			var m = new Member();
			m.name = member.name;
			m.email = member.email;

			var thumbnailUrl = member.thumbnailUrl;

			m.save( function(err, m) {
				
				if (err) console.error(err);

				console.log('> member created: '  + m.name);

				//process thumbnail 
				if (thumbnailUrl !== null && thumbnailUrl.length>0) {
					console.log('  - retrieve thumbnail ' + thumbnailUrl);

					//open up a new writestream, store the parent document's id in the file metadata
					var writeStream = gfs.createWriteStream({
							filename : thumbnailUrl,
							metadata : {
								'parentId' : m.id
							}
						});

					//retrieve the file from Teamroom and store it to Mongo
					request.get( {
						uri : 'https://' + config.dominoServerUrl + thumbnailUrl,
						strictSSL : false 
					})
						.auth( config.user, config.password)
						.pipe( writeStream );
				}

			});


		}


	});
}