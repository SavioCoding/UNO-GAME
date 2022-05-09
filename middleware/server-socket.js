const util = require("./util");
const Game = require("./game-server");

module.exports = function (io) {
	io.on("connection", (socket) => {
		if (socket.request.session.user) {
			const { username } = socket.request.session.user;
			console.log("Socket: " + username + " connected");

			onlineUsers[username] = "some other properties";
		}
		socket.on("queue", () => {
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				players.push(username);
				gameState[username] = [];
				if (players.length == 2) {
					Game.startGame(gameState);
					// tell client side to render cards
					io.emit("game state", JSON.stringify(gameState));
				}
			}
		});

		socket.on("draw card", () => {
			console.log("draw");
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				Game.drawCard(gameState, username);
				Game.switchTurn(gameState);
				io.emit("game state", JSON.stringify(gameState));
			}
		});

		socket.on("play card", (card) => {
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				Game.playCard(gameState, username, JSON.parse(card));
				if (Game.isGameEnd(gameState)) {
					// end game
					const resultObj = Game.endGame(gameState, "card");
					io.emit("gameover", JSON.stringify(resultObj));
				} else {
					if (gameState[username].length == 1) {
						io.emit("show uno", username);
					}
					io.emit("game state", JSON.stringify(gameState));
				}
			}
		});

		socket.on("request cheat", () => {
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				console.log(username + " cheated");
				matchStat[username].numCheats++;
				io.emit("cheated", username);
			}
		});

		socket.on("affirm uno", () => {
			// if player with one card left press uno first, do nothing
			io.emit("hide uno");
		});

		socket.on("deny uno", () => {
			// add two cards to the player
			let deniedPlayer = null;
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				for (const p of players) {
					if (p != username) deniedPlayer = p;
				}
				// add two cards
				for (let i = 0; i < 2; ++i) {
					Game.drawCard(gameState, deniedPlayer);
				}
				io.emit("hide uno");
				io.emit("game state", JSON.stringify(gameState));
			}
		});

		socket.on("time", () => {
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				const resultObj = Game.endGame(gameState, "time", username);
				io.emit("gameover", JSON.stringify(resultObj));
			}
		});
	});
};
