var express = require("express");
var port = 8080;
var ws = express();

var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost:27017/ensembl_bd', { useNewUrlParser: true });

const request = require('request');

var db = require('./db');
var Studies = require('./models/study');

// lookup handlers
ws.get("/lookup/:id/:expand", (req, resp, next) => {
	// params from request
	let id = req.params.id;
	let expand = req.params.expand;

	Studies.getRequestByTypeAndSpeciesId("lookup", id, function(err, studies) {
		//has to make new request to ensembl ws
		if(studies.length == 0) 
		{
			console.log("Lookup: No study found in ws db");

			// forming response request
			let url = "https://rest.ensembl.org/lookup/id/" + id + "?expand=" + expand + ";content-type=application/json";

			// http request to ensembl api
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				//console.log(body);
				let ensembl_response = body;

				//builds collection object and inserts it in mongodb
				let new_study = new Studies(
				{
					speciesId: id, 
					req_type: "lookup", 
					format: "n/a for lookup", 
					feature: "n/a for lookup",
					reg_init: "n/a for lookup",
					reg_end: "n/a for lookup",
					dataset: ensembl_response
				});

				new_study.save(Studies, function(err, succ) {
					if(err) return console.log(err);

					else return console.log("Success");
				});

				//sends the new object as this ws response
				return resp.send(new_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Lookup: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Lookup: More than one study found!");
			return resp.send("Lookup: More than one study found, something went wrong!");
		}
	});
});

// archive hanlders
ws.get("/archive/:id", (req, resp, next) => {
	// forming response request
	let url = "https://rest.ensembl.org/archive/id/" + req.params.id + "?content-type=application/json";
	let id = req.params.id;

	Studies.getRequestByTypeAndSpeciesId("archive", id, function(err, studies) {
		if(studies.length == 0)
		{
			console.log("Archive: No study found in ws db");

			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesId: id, 
					req_type: "archive", 
					format: "n/a for archive", 
					feature: "n/a for archive",
					reg_init: "n/a for archive",
					reg_end: "n/a for archive",
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});

		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Archive: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Archive: More than one study found!");
			return resp.send("Archive: More than one study found, something went wrong!");
		}
	});
});

// mapping handlers
// req_type: map_cdna
ws.get("/map/cdna/:id/:reg_init/:reg_end", (req, resp, next) => {
	let id = req.params.id;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;

	let url = "https://rest.ensembl.org/map/cdna/" + id + "/" + region_start + ".." + region_end + "?content-type=application/json";
	// request_type, species_id, region_in, region_end, callback
	Studies.getRequestMapByTypeAndSpeciesIdAndRegions("map_cdna", id, region_start, region_end, function(err, studies) {
		if(studies.length == 0)
		{
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesId: id, 
					req_type: "map_cdna", 
					format: "n/a for map_cdna", 
					feature: "n/a for map_cdna",
					reg_init: region_start,
					reg_end: region_end,
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Map CDNA: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Map CDNA: More than one study found!");
			return resp.send("Map CDNA: More than one study found, something went wrong!");
		}
	});
});

ws.get("/map/cds/:id/:reg_init/:reg_end", (req, resp, next) => {
	let id = req.params.id;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;

	let url = "https://rest.ensembl.org/map/cds/" + id + "/" + region_start + ".." + region_end + "?content-type=application/json";

	Studies.getRequestMapByTypeAndSpeciesIdAndRegions("map_cds", id, region_start, region_end, function(err, studies) {
		if(studies.length == 0)
		{
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesId: id, 
					req_type: "map_cds", 
					format: "n/a for map_cds", 
					feature: "n/a for map_cds",
					reg_init: region_start,
					reg_end: region_end,
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Map CDS: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Map CDS: More than one study found!");
			return resp.send("Map CDS: More than one study found, something went wrong!");
		}
	});
});

// converts coords in assembly_1 to corresponding coords in assembly_2
// request_type, species_id, region_in, region_end, assembly_1, assembly_2, callback
ws.get("/map/:species/:asm_1/:reg_init/:reg_end/:asm_2", (req, resp, next) => {
	let species = req.params.species;
	let assembly_1 = req.params.asm_1;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;
	let assembly_2 = req.params.asm_2;

	let url = "https://rest.ensembl.org/map/" + species + "/" + assembly_1 + "/X:" + region_start + ".." + region_end;
	url += "/" + assembly_2 + "?content-type=application/json";

	Studies.getRequestMapBySpeciesIdAndRegionsAndAssemblies("map", species, region_start, region_end, assembly_1, assembly_2, function(err, studies) {
		if(studies.length == 0)
		{
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesAlias: species, 
					req_type: "map", 
					format: "n/a for map", 
					feature: "n/a for map",
					reg_init: region_start,
					reg_end: region_end,
					asm_1: assembly_1,
					asm_2: assembly_2,
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Map: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Map: More than one study found!");
			return resp.send("Map: More than one study found, something went wrong!");
		}
	});
});

// overlap handlers
// retrieves features (genes, transcripts, variants...) that overlap a region defined by the given id
// request_type, species_id, feat, callback
ws.get("/overlap/:id/:feature", (req, resp, next) => {
	let id = req.params.id;
	let feat = req.params.feature;
	/*let features = JSON.parse(req.query.features);
	features.forEach(function(feature) {
		console.log(feature);
	});*/

	let url = "https://rest.ensembl.org/overlap/id/" + id + "?feature=" + feat + ";content-type=application/json";

	Studies.getRequestOverlapBySpeciesIdAndFeature("overlap", id, feat, function(err, studies) {
		if(studies.length == 0)
		{
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesId: id, 
					req_type: "overlap", 
					format: "n/a for overlap", 
					feature: feat,
					reg_init: "n/a for overlap",
					reg_end: "n/a for overlap",
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Overlap: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Overlap: More than one study found!");
			return resp.send("Overlap: More than one study found, something went wrong!");
		}
	});
});

// sequence handlers
// GET sequence/region/:species/:region
//format = content_type
ws.get("/sequence/:id/:content_type/:type", (req, resp, next) => {
	let id = req.params.id;
	let sequence_type = req.params.type;
	let content = req.params.content_type;

	let url = "https://rest.ensembl.org/sequence/id/" + id + "?content-type=";
	if(content == "fasta")
	{
		url += "text/x-fasta";
	}
	else url += "application/json";

	if(req.params.type) // type	Enum(genomic,cds,cdna,protein)
	{
		url += ";type=" + req.params.type;
	}

	Studies.getRequestByTypeAndSpeciesIdAndFormat("sequence", id, content, sequence_type, function(err, studies) {
		if(studies.length == 0)
		{
			request(url, {json: true}, (err, res, body) => {
				if(err) return console.log(err);

				let ensembl_resp = body;

				let n_study = new Studies(
				{
					speciesId: id, 
					req_type: "sequence", 
					format: content, 
					seq_type: sequence_type,
					dataset: ensembl_resp
				});

				n_study.save(studies, function(err, succ) {
					if(err) return console.log(err);
					else return console.log("Success");
				});

				//console.log(body);
				return resp.send(n_study);
			});
		}
		else if(studies.length == 1) //study already done: can retrieve from local db
		{
			console.log("Sequence: One study found! Study: " + studies);
			return resp.send(studies);
		}
		else //error case when more than one study is retrieved from mongodb
		{
			console.log("Sequence: More than one study found!");
			return resp.send("Sequence: More than one study found, something went wrong!");
		}
	});
});

ws.listen(port, () => {
	console.log("Ensembl interaction Web Service running on port: " + port);
});