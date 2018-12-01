// EXPRESS SET UP
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var router = express.Router();
var apisRouter = express.Router({mergeParams: true});

var LocalStrategy = require('passport-local').Strategy;
var User = require('./../../models/user');

var path = require('path');
var cookieParser = require('cookie-parser');

// GET Studies page route
router.get('/', ensureAuthenticated,function(req, res) {
  res.render('./../views/apis', {title: 'Public Studies', user: req.user});
});

// GET Ensembl API page route
router.get('/:ensembl', ensureAuthenticated, function(req, res) {
  res.render('ensembl/ensembl', {title: 'Ensembl API page', user: req.user });
  /*var request = require('request');
  request('http://localhost:8080/lookup/20/1', function (error, response, body) {
    console.log(response.body);
  });*/
});

router.get('/:kegg', ensureAuthenticated, function(req, res) {
  res.render('ensembl/ensembl', {title: 'Kegg API page', user: req.user });
});

router.get('/:genbank', ensureAuthenticated, function(req, res) {
  res.render('ensembl/ensembl', {title: 'GenBank API page', user: req.user });
});

router.get('/:chem_spider', ensureAuthenticated, function(req, res) {
  res.render('ensembl/ensembl', {title: 'GenBank API page', user: req.user });
});

// authentication checker 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("AUTH");

    return next();
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;

//Example request for Ensembl REST API
//request('https://rest.ensembl.org/lookup/ENSG00000157764?expand=1;content-type=application/json'
//request('https://rest.ensembl.org/sequence/region/human/ABBA01004489.1:1..100?content-type=text/x-fasta;coord_system=seqlevel'