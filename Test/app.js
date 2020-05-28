var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var errorhandler = require('errorhandler');
var logger = require("morgan");
const dotenv = require("dotenv");
const fs = require('fs');
var cors = require('cors')
dotenv.config();

const database = require("./app/database/database");

var usersRouter = require("./routes/routes");
var app = express();

var server = require("http").Server(app);

// // Yes, SSL is required
// const serverConfig = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
// };


// var https = require('https').Server(serverConfig,app);

var io = require("socket.io")(server);
// var io = require("socket.io")(https);
// var counter=0;
app.use(function(req, res, next) {
  res.io = io;
  next();
});

io.on('connection', client => {
    console.log('coonect')
    client.on('disconnect', () => { 
         console.log('disconnect')
         
        });
  });
// app.use(cors())

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(require('express-status-monitor')());

app.use(express.static(path.join(__dirname, "public"), {
  extensions: ['html', 'htm'],
}));

// app.use(logger("dev"));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter(app));


app.use(errorhandler({ log: false })) //error log off
// app.use(errorhandler({ log: true })) //error log on

// module.exports = app;
module.exports = { app: app, server: server };
