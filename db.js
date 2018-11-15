// Mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/toolbox_bd_tes');


// Users
var user_coll_schema = new mongoose.Schema({
	name : String,
	type : String,
	username : String,
	password : String,
	field : String,
	institution : String
	}, { collection : 'usercollection' }
);

user_coll_schema.methods.validPassword = function( pwd ) {

	return ( this.password === pwd );
};

// Studies

// Dataset


module.exports = {Mongoose: mongoose, UserSchema: user_coll_schema}