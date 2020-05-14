// "user strict";

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   process.env.DB_DATABASE || "",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "mysql",
//     // disable logging; default: console.log
//     logging: false,
//     // dialectOptions: {
//     // timezone: 'Asia/Calcutta',
//     // useUTC: false, //for reading from database
//     // dateStrings: true,
//     // typeCast: true
//     //   },
//       timezone: '+05:30' //for writing to database
//     // timezone: "Asia/Calcutta",
//   }
// );

// //Checking connection status
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database Connection has been established successfully.");
//   })
//   .catch((err) => {
//     // console.error('Unable to connect to the database:', err);
//     // console.error('Original Error: ', err.original.Error);
//     console.error("Original errno: ", err.original.errno);
//     console.error("Original code: ", err.original.code);
//     console.error("Original syscall: ", err.original.syscall);
//     console.error("Original address: ", err.original.address);
//     console.error("Original port: ", err.original.port);
//     console.error("Original fatal: ", err.original.fatal);
//   });

// global.sequelize = sequelize;

// //-----------------------------------------------------------------
// //-----------------    Knex     -----------------------------------
// //-----------------------------------------------------------------

// const options = {
//   client: "mysql",
//   connection: {
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "",
//     database: process.env.DB_DATABASE || "",
//   },
//   log: {
//     warn(message) {
//       console.log(message);
//     },
//     error(message) {
//       console.log(message);
//     },
//     deprecate(message) {
//       console.log(message);
//     },
//     debug(message) {
//       console.log(message);
//     },
//   },
// };
// const knex = require("knex")(options);
// // knex.on( 'query', function( queryData ) {
// //   console.log( queryData );
// // });
// global.knex = knex;

var mongoose = require("mongoose");

var connectionString= process.env.CONNECTION_STRING
var options={
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
mongoose.connect(connectionString,options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "database connection error"));
db.once('open', () => {
    console.log("connection to database successfull");
})