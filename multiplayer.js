class multiplayer {
    constructor(log) {
        this.socket = io();
        console.log(this.socket)
        if (typeof log != "undefined") {
            socket.on('log', log);
        }
    }

    addEvent(event, eventFun) {
        console.log(this.socket)
        this.socket.on(event, eventFun);
    }

    addEvents(events) {
        events.forEach(function (element) {
            this.socket.on(element.event, element.eventFun);
        });
    }
    
    sendData(id, data) {
        this.socket.emit(id, data);
    }
}
