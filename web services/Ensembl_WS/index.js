var express = require("express");
var port = 8080;
var ws = express();

const request = require('request');

// handlers
ws.get("/species/1", (req, resp, next) => {
 	resp.json(["Species nº 1 information"]);
});

// lookup handlers
ws.get("/lookup/:id/:expand", (req, resp, next) => {
	// params from request
	let id = req.params.id;
	let expand = req.params.expand;

	// forming response request
	let url = "https://rest.ensembl.org/lookup/" + id + "?expand=" + expand + ";content-type=application/json";

	// http request to ensembl api
	request(url, {json: true}, (err, res, body) => {
		if(err) {
			return console.log(err);
		}

		console.log(body);
		return resp.send(body);

		// check if lookup for id is already in the mongo db (findOne) tut luiz

	});

});

ws.listen(port, () => {
	console.log("Ensembl interaction Web Service running on port: " + port);
});

//https://rest.ensembl.org/lookup/ENSG00000157764?expand=1;content-type=application/json