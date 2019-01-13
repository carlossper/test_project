// Mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ensembl_db', { useNewUrlParser: true }, function(err) {
	if(err) return console.log(err);
});

// Studies
var ensembl_study_schema = new mongoose.Schema({
	speciesId : String,
	speciesAlias: String,
	req_type : String,
	format : String,
	feature : String,
	reg_init: String,
	reg_end: String,
	asm_1: String,
	asm_2: String,
	seq_type: String,
	dataset : Object
	}, {collection : 'requestcollection' }
);

module.exports = {Mongoose: mongoose, StudySchema: ensembl_study_schema }