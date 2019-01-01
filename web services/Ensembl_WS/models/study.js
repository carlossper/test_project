var db = require('../db.js');

var mongoose = require('mongoose');

var Studies = module.exports = mongoose.model("Study", db.StudySchema);

module.exports.getRequestsByType = function (request_type, callback) {
	var query = {req_type: request_type};
    Studies.find(query, callback);
};


module.exports.getRequestByTypeAndSpeciesId = function (request_type, species_id, callback) {
    //var query = {req_type: request_type, species: species_id};
    var query = {req_type: request_type};
    console.log('inside getreqby function request_type: ' + request_type + ' species_id: ' + species_id);
    //Studies.find({ $and : [{req_type: request_type}, {species: species_id}] }, callback);
    Studies.findOne(query, callback);
};


module.exports.getRequestById = function (id, callback) {
    Studies.findById(id, callback);
};

