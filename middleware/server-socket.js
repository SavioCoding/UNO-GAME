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
				players.player1 = username;
			}
		});
	});
};
