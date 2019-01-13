var db = require('../db.js');

var mongoose = require('mongoose');

var Studies = module.exports = mongoose.model("Study", db.StudySchema);

module.exports.getRequestById = function (id, callback) {
    Studies.findById(id, callback);
};

module.exports.getRequestsByType = function (request_type, callback) {
	var query = {req_type: request_type};
    Studies.find(query, callback);
};

module.exports.getRequestByTypeAndSpeciesId = function (request_type, species_id, callback) {
    //console.log('getRequestByTypeAndSpeciesId : request_type: ' + request_type + ' species_id: ' + species_id);s
    Studies.find({ $and : [{req_type: request_type}, {speciesId: species_id}] }, callback);
};

module.exports.getRequestByTypeAndSpeciesIdAndFormat = function (request_type, species_id, content_type, sequence_type, callback) {
    //console.log('getRequestByTypeAndSpeciesId : request_type: ' + request_type + ' species_id: ' + species_id);s
    Studies.find({ $and : [{req_type: request_type}, {speciesId: species_id}, {format: content_type}, {seq_type: sequence_type}] }, callback);
};

module.exports.getRequestMapByTypeAndSpeciesIdAndRegions = function (request_type, species_id, region_in, region_end, callback) {
    //console.log('getRequestByTypeAndSpeciesId : request_type: ' + request_type + ' species_id: ' + species_id);s
    Studies.find({ $and : [{req_type: request_type}, {speciesId: species_id}, {reg_init: region_in}, {reg_end: region_end}] }, callback);
};

module.exports.getRequestOverlapBySpeciesIdAndFeature = function (request_type, species_id, feat, callback) {
    //console.log('getRequestByTypeAndSpeciesId : request_type: ' + request_type + ' species_id: ' + species_id);s
    Studies.find({ $and : [{req_type: request_type}, {speciesId: species_id}, {feature: feat}] }, callback);
};

module.exports.getRequestMapBySpeciesIdAndRegionsAndAssemblies = function (request_type, species_id, region_in, region_end, assembly_1, assembly_2, callback) {
    //console.log('getRequestByTypeAndSpeciesId : request_type: ' + request_type + ' species_id: ' + species_id);s
    Studies.find({$and : [{req_type: request_type}, {speciesAlias: species_id}, {reg_init: region_in}, {reg_end: region_end}, {asm_1: assembly_1}, {asm_2: assembly_2}]}, callback);
};