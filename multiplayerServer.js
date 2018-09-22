console.log("included")

class MultiplayerServer {
    constructor(getResponse, port, directories) {
        // Dependencies
        this.express = require('express');
        this.http = require('http');
        this.path = require('path');
        this.socketIO = require('socket.io');

        this.app = this.express();
        this.server = this.http.Server(this.app);
        this.io = this.socketIO(this.server);
        this.port = port;
        var app = this.app;
        var express = this.express;
        if (typeof port != "number")
            this.port = 5000;
        this.app.set('port', this.port);
        if (typeof directories == "object") {
            directories.forEach(function (element, index) {
                app.use(express.static(__dirname + element));
            });
        }
        console.log(__dirname);
        console.log(typeof getResponse);
        if (typeof getResponse == "string") {
            this.app.get('/', function (req, res) {
                res.sendFile(__dirname+'/'+getResponse)
            })
        } else {
            this.app.get('/', function (req, res) {
                res.sendFile(__dirname+'/index.html')
            })
        }
    }

    startServer() {
        var port = this.port;
        this.server.listen(this.port, function () {
            console.log('Starting server on port ' + port);
        });
        this.io.sockets.emit("log", "server started");
    }

    addEvent(event, eventFun) {
        this.io.on(event, eventFun);
        this.io.sockets.emit("log", "waiting data with id: " + event);
    }

    addEvents(events) {
        events.forEach(function (element) {
            this.io.on(element.event, element.eventFun);
            this.io.sockets.emit("log", "waiting data with id: " + element.event);
        });
    }

    sendData(id, data) {
        this.io.sockets.emit(id, data);
        this.io.sockets.emit("log", "sending data with id: " + id);
    }
}
module.exports = MultiplayerServer;
