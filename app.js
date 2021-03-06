var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');

var routes = require('./routes/index');
var users = require('./routes/users');
var userBadges = require('./routes/userBadges');
var players = require('./routes/players');
var hosts = require('./routes/hosts');
var questions = require('./routes/questions');
var catagories = require('./routes/catagories');
var auth = require('./routes/auth');
var games = require('./routes/games');
var decks =  require('./routes/decks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', routes);
app.use('/users', tokenAuthenicated, users);
app.use('/users/badges', userBadges);
app.use('/players', tokenAuthenicated, players);
app.use('/hosts', tokenAuthenicated, hosts);
app.use('/questions', tokenAuthenicated, questions);
app.use('/catagories', tokenAuthenicated, catagories);
app.use('/games', tokenAuthenicated, games);
app.use('/decks', tokenAuthenicated, decks);
app.use('/auth', auth);
app.use('/decks', decks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function tokenAuthenicated(req, res, next){
 // check header or url parameters or post parameters for token
 var token = req.body.token || req.query.token || req.headers.token;

 // decode token
 if (token) {
 // verifies secret and checks exp
   jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
     if (err) {
       //if you can't decode token
       return res.status(403).json({ error: false, data: 'Failed to authenticate token.' });
     } else {
       // if everything is good, save to request for use in other routes
       req.decoded = decoded;
       next();
     }
   });
  } else {
   // if there is no token
   // return an error
   return res.status(403).json({
       error: true,
       data: 'No token provided.'
   });
 }

}

module.exports = app;
