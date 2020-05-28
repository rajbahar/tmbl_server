
var c = 0;
setInterval(() => {

    var socket = require('socket.io-client')('http://tatalb-656815788.ap-south-1.elb.amazonaws.com');
    socket.on('connect', function () {
        c=c+1;
        console.log("SOCKET CLIENT CONNECT - "+c)
    });

    socket.on('disconnected', function () {
        c=c-1;
        console.log("SOCKET CLIENT disconeect -*********************************---- "+c)
    });

}, 3);