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
				console.log("Socket: added " + username + " to queue");
				if (!players.player1) {
					players.player1 = username;
				} else {
					players.player2 = username;
					// all players present => start the game
					io.emit("start game");
				}

				// TODO: server-side start the game
				console.log("game started " + players);
			}
		});
	});
};
