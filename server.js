MultiplayerServer = require('./multiplayerServer.js');
var multiplayerGame = new MultiplayerServer("index.html", 5000, ["/","/js","/css"]);
multiplayerGame.startServer();