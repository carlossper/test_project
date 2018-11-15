var db = require('../db.js');

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');



db.UserSchema.plugin(passportLocalMongoose);

var Users = module.exports = mongoose.model("User", db.UserSchema);

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    Users.findOne(query,callback);
};

module.exports.getUserById = function (id, callback) {
    Users.findById(id, callback);
};