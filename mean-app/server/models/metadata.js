var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var MetadataSchema	= new Schema( {
	name : String, 
	purpose : String,
	created : { type : Date, default : Date.now }
});

module.exports = mongoose.model('Metadata', MetadataSchema);
