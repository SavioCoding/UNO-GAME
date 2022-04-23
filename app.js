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

const gameSession = session({
	secret: "uno",
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: { maxAge: 300000 },
});
app.use(gameSession);

// Global Variables
onlineUsers = {}; // logged in users
players = { player1: null, player2: null }; // players in game, can use to store the cards they have

io.use((socket, next) => {
	gameSession(socket.request, {}, next);
});

require("./middleware/server-ajax")(app); // add post/get methods to add
require("./middleware/server-socket")(io); // add listeners to io

httpServer.listen(8000, () => {
	console.log("Game server starting...");
});
