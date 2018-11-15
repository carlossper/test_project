// EXPRESS SET UP
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../../models/user');

var path = require('path');
var cookieParser = require('cookie-parser');

// PASSPORT SET UP
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var Users = require('./../../models/user');


// GET Register page route
router.get('/', function(req, res) {
  res.render('register', {title: 'Register an account', message: '', user: req.user});
});

// GET User List page route
router.get('/user_list', function(req, res) {
  // Loads db.js
  var db = require('./../../db');

  // Adds collection
  var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usercollection');

  // Looks for all users - Notice empty filter ({}) -> Plain text JSON
  Users.find({}).lean().exec(
    function(e, docs) {
      res.render('user_list', {'user_list': docs});
    });
});

// POST REQUESTS - FUNCTIONS
router.post('/', function(req, res) {
  var db = require('./../../db');
  var fullname = req.body.name;
  var username_req = req.body.username;
  var field_req = req.body.field;
  var inst_req = req.body.institution;
  var password_1 = req.body.password;
  var password_2 = req.body.password_2;

  if(password_1 == password_2)
  {
    // TODO: Check if username already exists
    var username_list = Users.find({}, {_id:0, username:1});

    Users.findOne({username:username_req},function(err, doc){
      let response = { sucess: true, msg: "inside - findone()"};

      // Username available
      if(!doc){
        response.msg = "Username available";
        console.log(response.msg);

        // Adds to user to the collection
        Users.register(new Users({
          name: fullname, 
          type: 1, 
          username: username_req,   
          password: password_1, 
          field: field_req, 
          institution: inst_req}), 
        req.body.password, 
        function(err, user) {
          if(err){
            console.log(err);
            return res.render('register', {user: req.user});
          }

          passport.authenticate('local')(req, res, function(){
            return res.redirect("/");
          }); 
        });
      }
      else{
        response.msg="The username already exists";
        console.log(response.msg);
        return res.render('register', { message: 'Username taken' , user: ''});
      }
    });
  }
  else //TODO:: passwords don't match
  {
    return res.render('register', { message: 'Passwords do not match' });
  }
});

module.exports = router;