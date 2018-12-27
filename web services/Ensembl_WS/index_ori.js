var express = require("express");
var port = 8080;
var ws = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/toolbox_bd_tes');

const request = require('request');

// lookup handlers
ws.get("/lookup/:id/:expand", (req, resp, next) => {
	// check if lookup for id is already in the mongo db (findOne) tut luiz

	// params from request
	let id = req.params.id;
	let expand = req.params.expand;

	// forming response request
	let url = "https://rest.ensembl.org/lookup/id/" + id + "?expand=" + expand + ";content-type=application/json";

	// http request to ensembl api
	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);

	});
});

// archive hanlders
ws.get("/archive/:id", (req, resp, next) => {
	// forming response request
	let url = "https://rest.ensembl.org/archive/id/" + req.params.id + "?content-type=application/json";

	// http request to ensembl api
	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);

		// check if archive for id is already stored 
	});
});

// mapping handlers
ws.get("/map/cdna/:id/:reg_init/:reg_end", (req, resp, next) => {
	let id = req.params.id;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;

	let url = "https://rest.ensembl.org/map/cdna/" + id + "/" + region_start + ".." + region_end + "?content-type=application/json";

	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);
	});
});

ws.get("/map/cds/:id/:reg_init/:reg_end", (req, resp, next) => {
	let id = req.params.id;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;

	let url = "https://rest.ensembl.org/map/cds/" + id + "/" + region_start + ".." + region_end + "?content-type=application/json";

	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);
	});
});

// converts coords in assembly_1 to corresponding coords in assembly_2
ws.get("/map/:species/:asm_1/:reg_init/:reg_end/:asm_2", (req, resp, next) => {
	let species = req.params.species;
	let assembly_1 = req.params.asm_1;
	let region_start = req.params.reg_init;
	let region_end = req.params.reg_end;
	let assembly_2 = req.params.asm_2;

	let url = "https://rest.ensembl.org/map/" + species + "/" + assembly_1 + "/X:" + region_start + ".." + region_end;
	url += "/" + assembly_2 + "?content-type=application/json";

	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);
	});
});

// overlap handlers
// retrieves features (genes, transcripts, variants...) that overlap a region defined by the given id
ws.get("/overlap/:id/:feature", (req, resp, next) => {
	let id = req.params.id;
	let feature = req.params.feature;
	/*let features = JSON.parse(req.query.features);
	features.forEach(function(feature) {
		console.log(feature);
	});*/

	let url = "https://rest.ensembl.org/overlap/id/" + id + "?feature=" + feature + ";content-type=application/json";

	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);
	});
});

// sequence handlers
// GET sequence/region/:species/:region
ws.get("/sequence/:id/:content_type/:type", (req, resp, next) => {
	let id = req.params.id;
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

	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);
	});
});

ws.listen(port, () => {
	console.log("Ensembl interaction Web Service running on port: " + port);
});