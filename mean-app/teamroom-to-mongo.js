/*
 * This script will export all team documents from a Domino TeamRoom database to a
 * (remote) MongoDB database. A seperate application needs to be installed on the 
 * Domino server that can offer the REST service to get to the documents. 
 */

var https		= require('https');
var config 		= require('./config/db');		//config file
var mongoose	= require('mongoose');

//init gridfs-stream
var Grid		= require('gridfs-stream');
Grid.mongo 		= mongoose.mongo;

var importFunctions	= require('./importFunctions');

console.log(" ");
console.log("***** started teamroom-to-mongo conversion *****");

console.log("using Teamroom API app on server " + config.dominoServerUrl + " at " + config.teamRoomAPIPath);

var httpOptions = {
	host : config.dominoServerUrl,
	path : null,
	method : null,
	headers : null,
	rejectUnauthorized: false,
	auth : config.user + ':' + config.password
};

//connect to the Mongo db
mongoose.connect(config.url);

var conn = mongoose.connection;
conn.once('open', function() {
	console.log('Connection to MongoDB at ' + config.url + ' is open, opening GridFS');

	//create a connection to the GridFS to store files
	global.gfs = (global.gfs ? global.gfs : Grid(conn.db) );
});

//retrieve all teamroom documents and process them
var httpGetTeamDocs = httpOptions;
httpGetTeamDocs.method = 'GET';
httpGetTeamDocs.path = config.teamRoomAPIPath + '/getDocuments.xsp';

var req = https.request( httpGetTeamDocs, function(res) {

	var body = '';
	//console.log('statusCode:', res.statusCode);

	res.on('data', function(chunk) {
		body += chunk;
	});

	res.on('end', function() {
		var json = JSON.parse(body);
		console.log('number of team documents: ' + json.total);

		for( var i=0; i<json.items.length; i++) {
			importFunctions.processTeamroomDoc(json.items[i], (i+1), json.total);
		}

		importFunctions.processMetadata(json.metadata);

	});

});

req.end();

req.on('error', function(e) {
	console.error(e);
});

console.log("***** finished *****");
console.log(" ");