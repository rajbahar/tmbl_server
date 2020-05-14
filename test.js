
var c = 0;
setInterval(() => {

    var socket = require('socket.io-client')('http://localhost:3000/');
    socket.on('connect', function () {
        c=c+1;
        console.log("SOCKET CLIENT CONNECT"+c)
    });

    socket.on('disconnected', function () {
        console.log("SOCKET CLIENT disconeect"+c)
    });

}, 500);