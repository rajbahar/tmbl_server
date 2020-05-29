'use strict';
var wrap = require('co-express');
const LiveSocketController = require('../app/Controller/LiveSocketController');
const _liveSocketController = new LiveSocketController();



wrap(function* () {
    yield _liveSocketController.DeleteAll();
});

function SocketsRoutes(io) {

    io.on('connection', wrap(function* (socket) {
        // console.log('coonect')

        ///  
        socket.on('client_connect', wrap(function* (data) {
            let SID = { SocketID: socket.id };
            yield _liveSocketController.Add(SID)
            //emit total live user list on admin
            let LiveUsers = yield _liveSocketController.List();
            io.sockets.in('admin').emit('onLiveUsers', LiveUsers);

        }));

        ///
        socket.on('join', wrap(function* (data) {
            socket.join(data.Room);
            socket.emit('join', data);
            //emit total live user list on admin
            let LiveUsers = yield _liveSocketController.List();
            io.sockets.in('admin').emit('onLiveUsers', LiveUsers);
            //------------------------------------------------------------------
            //------------------------------------------------------------------
            let RegisterUsers = yield _liveSocketController.RegisterUserList();
            io.sockets.in('admin').emit('onRegisterUsers', RegisterUsers);
        }));


        ///
        socket.on('disconnect', wrap(function* () {
            // console.log('disconnect')
            let data = { id: socket.id }
            yield _liveSocketController.Delete(data);
            let LiveUsers = yield _liveSocketController.List();
            io.sockets.in('admin').emit('onLiveUsers', LiveUsers);

        }));


    }));

}



module.exports = SocketsRoutes;