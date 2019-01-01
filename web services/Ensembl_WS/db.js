// Mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ensembl_db', { useNewUrlParser: true }, function(err) {
	if(err) return console.log(err);
});

// Studies
var ensembl_study_schema = new mongoose.Schema({
	species : String,
	req_type : String,
	format : String,
	feature : String
	}, {collection : 'requestcollection' }
);

module.exports = {Mongoose: mongoose, StudySchema: ensembl_study_schema }