var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var errorhandler = require('errorhandler');


const dotenv = require("dotenv");
var cors = require('cors')
dotenv.config();

const database = require("./app/database/database");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var socketRouter = require('./routes/sockets');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(cors())
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.io = io;
    next();
  });

app.use('/', indexRouter(app));
app.use('/users', usersRouter);

socketRouter(io);

app.use(errorhandler({ log: false })) //error log off
// app.use(errorhandler({ log: true })) //error log on

// module.exports = app;
module.exports = {app: app, server: server};


