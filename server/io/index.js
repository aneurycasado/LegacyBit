'use strict';
var socketio = require('socket.io');
var io = null;
//How do I use this?
module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function () {
        // Now have access to socket, wowzers!
    });

    return io;

};
