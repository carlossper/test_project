// EXPRESS SET UP
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var path = require('path');
var cookieParser = require('cookie-parser');

// PASSPORT SET UP
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var Users = require('../models/user');

///////////////////////////////////////////////////////////////////////////////////////////////////

// GET Home page route
router.get('/', ensureAuthenticated, function(req, res) {
  if (req.user && req.user.type == 1) {

    console.log(req.user);

    res.render('index_researcher', {user: req.user});
  }
  else if (req.user && req.user.type == 2){

    console.log(req.user);

    res.render('index_admin', {user: req.user});
  }
});

// GET Login page route
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', user: req.user});
});

// GET Register page route
router.get('/register', function(req, res) {
  res.render('register', {title: 'Register an account', message: '', user: req.user});
});

// GET About page route
router.get('/about', function(req, res) {
  res.render('about', {title: 'About the Toolbox', user: req.user});
});

// GET Studies page route
/*router.get('/studies', ensureAuthenticated,function(req, res) {
  //res.render('studies', {title: 'Public Studies', user: req.user});
  var request = require('request');
request('https://rest.ensembl.org/sequence/region/human/ABBA01004489.1:1..100?content-type=text/x-fasta;coord_system=seqlevel', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
});*/

// GET Studies page route
router.get('/studies/species_ex', ensureAuthenticated,function(req, res) {
  //res.render('studies', {title: 'Public Studies', user: req.user});
  var request = require('request');
  request('https://rest.ensembl.org/sequence/region/human/ABBA01004489.1:1..100?content-type=text/x-fasta;coord_system=seqlevel', function (error, response, body) {
    console.log(body);
    
  });
});

// GET Studies page route
router.get('/studies', ensureAuthenticated,function(req, res) {
  res.render('studies', {title: 'Public Studies', user: req.user});
});

// GET User List page route
router.get('/user_list', function(req, res) {
  // Loads db.js
  var db = require('../db');

  // Adds collection
  var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usercollection');

  // Looks for all users - Notice empty filter ({}) -> Plain text JSON
  Users.find({}).lean().exec(
    function(e, docs) {
      res.render('user_list', {'user_list': docs});
    });
});

// GET Logout page route
router.get("/logout", function(req, res){ 
 req.logout();
 req.flash('success_msg', 'Logged out!');
 req.session.destroy();
 res.redirect("/login");
});

///////////////////////////////////////////////////////////////////////////////////////////////////

// POST REQUESTS - FUNCTIONS
router.post('/register_user', function(req, res) {
  var db = require('../db');
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
      let response = { sucess: true, msg: "True - Inside findOne()"};

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
        return res.render('register', { message: 'Username taken' });
      }
    });
  }
  else //TODO:: passwords don't match
  {
    return res.render('register', { message: 'Passwords do not match' });
  }
});

// LOGIN POST
router.post("/login", 
  passport.authenticate("local",{ successRedirect:"/", failureRedirect:"/login"}),
  function(req, res){
    // Sends username to handle in client side
    if(req.user)
    {
      res.redirect('/', req.user);
    }
    else {
      res.redirect('/login', req.message)
    }
});

// PASSPORT SET UP
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new LocalStrategy(
  function (username, password, done) {
    Users.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user){
        console.log("HERE");
        return done(null, false, {message: 'Unkown user'});
      }
      else if (user && user.password == password) {
        console.log("THERE"); 

        return done(null, user);
      }
      else {
        return done(null, false, {message: 'Invalid password'});
      }

    });
  })
);

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    return done(err, user);
  });
});

router.use(bodyParser.urlencoded({extended:true}));

///////////////////////////////////////////////////////////////////////////////////////////////////

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