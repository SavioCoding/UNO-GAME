const fs = require("fs");
const util = require("./util");

module.exports = function (app, io) {
	io.on("connection", (socket) => {
		if (socket.request.session.user) {
			const { username } = socket.request.session.user;
			console.log("Socket: " + username + " connected");

			onlineUsers[username] = "some other properties";
		}

		socket.on("queue", () => {
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				console.log("Socket: added " + username + " to queue");
				players[username] = [];
				if (Object.keys(players).length == 2) {
					io.emit("start game");

					// import and create the deck, store in app.get("deck")
					const jsonData = fs.readFileSync("./data/cards.json");
					const cards = JSON.parse(jsonData);
					deck = cards;

					//draw five card for two players
					for (let username in players) {
						for (let i = 0; i < 5; i++) {
							let card = util.drawCard(deck);
							players[username].push(card);
						}
					}
					// TODO: server-side start the game
					console.log("game started " + JSON.stringify(players));
				}
			}
		});
	});
};
