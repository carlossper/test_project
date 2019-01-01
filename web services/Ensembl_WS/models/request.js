var db = require('../db.js');

var mongoose = require('mongoose');


var Requests = module.exports = mongoose.model("Study", db.RequestSchema);


module.exports.getRequestByTypeAndSpeciesId = function (request_type, species_id, callback) {
    //var query = {req_type: request_type, species: species_id};
    var query = {req_type: request_type};
    console.log('inside getreqby function request_type: ' + request_type + ' species_id: ' + species_id);
    //Requests.find({ $and : [{req_type: request_type}, {species: species_id}] }, callback);
    Requests.find({}, callback);
};


module.exports.getRequestById = function (id, callback) {
    Requests.findById(id, callback);
};