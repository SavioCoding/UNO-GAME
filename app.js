const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");

const app = express();
app.use(express.static("public"));
app.use(express.json());

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

require("./middleware/server-authentication")(app);
require("./middleware/server-socket")(io);

io.use((socket, next) => {
	gameSession(socket.request, {}, next);
});

httpServer.listen(8000, () => {
	console.log("Game server starting...");
});
