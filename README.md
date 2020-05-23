# tmbl_server
npm install

#run server
npm start

#PM2:
 apps : [{
    script    : "api.js",
    instances : "max",
    exec_mode : "cluster"
  }]