var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control

var app = express();

//Model
const model = require('./routes/model.js');
//Services
const login = require('./routes/loginService.js');
const movieTicket = require('./routes/movieTicketService.js');
const movie = require('./routes/movieService.js');
const cinema = require('./routes/cinemaService.js');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({secret: 'nottelling'}));

//Service Routers
app.use('/login', login);
app.use('/myTickets', movieTicket);
app.use('/movie', movie);
app.use('/cinema', cinema);

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
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

app.listen(8081, function () {
	console.log("Server is running at :::8081")
});

module.exports = app;
