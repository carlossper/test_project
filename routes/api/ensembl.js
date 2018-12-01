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
  res.render('./../views/ensembl/ens_sequence', {title: 'Ensembl sequence lookup services', user: req.user});
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