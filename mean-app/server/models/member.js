var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;

var MemberSchema	= new Schema( {
	name : String, 
	email : String,
	created : { type : Date, default : Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);
