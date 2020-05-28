'use strict';
var wrap = require('co-express');
const LiveSocketController = require('../app/Controller/LiveSocketController');
const _liveSocketController = new LiveSocketController();



wrap(function *(){
    yield _liveSocketController.DeleteAll();
});

function SocketsRoutes(io) {

    io.on('connection', wrap(function* (socket) {
        // console.log('coonect')

        let SID = { SocketID: socket.id };
        yield _liveSocketController.Add(SID)
        //  

        socket.on('join', wrap(function* (data) {
            socket.join(data.Room);
            socket.emit('join', data);
            let data_ = { id: socket.id }
            yield _liveSocketController.Delete(data_);

        }));

        //emit total live user list on admin
        let LiveUsers = yield _liveSocketController.List();
        io.sockets.in('admin').emit('onLiveUsers', LiveUsers);

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