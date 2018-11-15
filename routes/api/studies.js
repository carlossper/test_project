// EXPRESS SET UP
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../../models/user');

var path = require('path');
var cookieParser = require('cookie-parser');

// GET Studies page route
router.get('/', ensureAuthenticated,function(req, res) {
  res.render('./../views/studies', {title: 'Public Studies', user: req.user});
});

// GET Studies page route
router.get('/species_ensembl', ensureAuthenticated,function(req, res) {
  //res.render('studies', {title: 'Public Studies', user: req.user});
  var request = require('request');
  /*request('https://rest.ensembl.org/sequence/region/human/ABBA01004489.1:1..100?content-type=text/x-fasta;coord_system=seqlevel', function (error, response, body) {
    console.log(body);
  });*/
  request('https://rest.ensembl.org/lookup/ENSG00000157764?expand=1;content-type=application/json', function (error, response, body) {
    console.log(body);
  });
});

router.get('/species_ex2', ensureAuthenticated,function(req, res) {
  //res.render('studies', {title: 'Public Studies', user: req.user});
  var request = require('request');
  request('https://localhost:3500/species', function (error, response, body) {
    console.log(response);
  });
});


// authentication checker 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("ensureAuthenticated -> isAuthenticated ");

    return next();
  }
  else {
    console.log("ensureAuthenticated -> !isAuthenticated ");

    res.redirect('/login');
  }
}

module.exports = router;