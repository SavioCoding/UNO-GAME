const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");
const { Http2ServerRequest } = require("http2");

const app = express();
app.use(express.static("public"));
app.use(express.json());

const gameSession = session({
	secret: "uno",
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: { maxAge: 300000 },
});
app.use(gameSession);

// Create Socket.IO server
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
	gameSession(socket.request, {}, next);
});

httpServer.listen(8000, () => {
	console.log("Game server starting...");
});
