var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

//sourceId = id of this item in Domino
//type = meeting, discussion, reference
var ItemSchema	= new Schema( {
	title : String,
	contents : String,
	sourceId : String,
	type : String,
	author : String,
	created : { type : Date, default : Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
