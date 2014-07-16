//simple Grid schem to be able to access file from GridFS using Mongoose syntax
//see http://stackoverflow.com/questions/24501839/list-all-gridfs-metadata-only-using-mongoose-on-nodejs

var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//sourceId = id of this item in Domino
var GridSchema	= new Schema( {}, { strict : false });

module.exports = mongoose.model('Grid', GridSchema, "fs.files" );
