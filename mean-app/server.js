//server.js

// modules
var express 	= require('express');
var app			= express();
var bodyParser	= require('body-parser');
var mongoose	= require('mongoose');
var favicon		= require('serve-favicon');
var config		= require('./config/db');		//config file

//init gridfs-stream
//var Grid		= require('gridfs-stream');
//Grid.mongo 		= mongoose.mongo;
//var gfs;

app.use( express.static(__dirname + '/public')); 
//app.use( bodyParser.urlencoded( {extended: true} ) );
app.use( bodyParser.json() );
app.use( favicon(__dirname + '/public/favicon.ico'));

//connect to the Mongo db
mongoose.connect(config.url);

mongoose.connection.once('open', function() {
	console.log('Connection to MongoDB at ' + config.url + ' is open');

	//create a connection to the GridFS to store files
	//gfs = Grid(conn.db);
});

//routes
var router = require('./server/router')(app);

var port = process.env.PORT || 8080;

//error handling
app.use( function(err, req, res, next) {
	res.status(err.status || 500);
});

module.exports = app;

//start app
app.listen(port);
console.log('Listening on port %d', port);
