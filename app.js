/*  Express Setup  */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var createError = require('http-errors');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

// models
var User = require('./models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.cookieSession());

// flash connection
app.use(flash());
 
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
 
app.use(passport.initialize());
app.use(passport.session());

// application routes
var indexRouter = require('./routes/api/index');
var loginRouter = require('./routes/api/login');
var usersRouter = require('./routes/api/users');
var regstRouter = require('./routes/api/register');
var studiesRouter = require('./routes/api/studies');
var apisRouter = require('./routes/api/apis');

//app.use('/', loginRouter);
app.use('/', indexRouter);
app.use('/register', regstRouter);
app.use('/register_user', regstRouter);
app.use('/users', usersRouter);
app.use('/user_list', usersRouter);
app.use('/studies', studiesRouter);


app.get("/secret",function(req, res){    
     res.render("secret");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.user = req.user || null;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;