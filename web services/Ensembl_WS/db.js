// Mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ensembl_bd');

// Studies
var ensembl_study_schema = new mongoose.Schema({
	species : String,
	req_type: String,
	format: String,
	feature: String
	}, {collection: 'requestcollection'}
);

module.exports = {Mongoose: mongoose, RequestSchema: ensembl_study_schema }

/*ensembl_study_schema.methods.validPassword = function( pwd ) {

	return ( this.password === pwd );
};*/
