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


// Routes
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

// GET About page route
router.get('/about', function(req, res) {
  res.render('about', {title: 'About the Toolbox', user: req.user});
});

// GET Logout page route
router.get("/logout", function(req, res){ 
 req.logout();
 req.flash('success_msg', 'Logged out!');
 req.session.destroy();
 res.redirect("/login");
});

// POST Login request
router.post("/login", 
  passport.authenticate("local",{ successRedirect:"/", failureRedirect:"/login"}),
  function(req, res){
    // Sends username to handle in Server side
    if(req.user)
    {
      res.redirect('/', req.user);
    }
    else {
      res.redirect('/login', req.message)
    }
});

// Passport Login logic
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new LocalStrategy(
  function (username, password, done) {
    Users.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user){
        console.log("unknow user info");
        return done(null, false, {message: 'Unkown user'});
      }
      else if (user && user.password == password) {
        console.log("user info found on mongo db"); 

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


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("ensureAuthenticated()");
    return next();
  }
  else {
    console.log("!ensureAuthenticated()");
    res.redirect('/login');
  }
}

module.exports = router;