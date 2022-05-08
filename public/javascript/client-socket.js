const Socket = (function () {
	let socket = null;

	const getSocket = function () {
		return socket;
	};

	const connect = function () {
		socket = io();

		socket.on("connect", () => {});
	};

	const queue = function () {
		socket.emit("queue");

		socket.on("game state", (gameState) => {
			gameState = JSON.parse(gameState);
			Game.renderState(gameState);
			WaitingScreen.hide();
		});

		socket.on("gameover", (gameOutcome) => {
			// remove game related listeners
			socket.off("game state");
			socket.off("gameover");
			// TODO: other listeners such as draw cards etc.

			// gameOutcome = {result: {tony:'win', may:'lose'}, players: [{gamertag, highscore}], stat:{tony: {"special card played": ...}}}
			let { result, players, stat } = JSON.parse(gameOutcome);
			result = result[Authentication.getUser().username]; //win or lose or tie
			stat = stat[Authentication.getUser().username];
			// const stat = gameOutcome.stat[Authentication.getUser().username];
			GameoverScreen.displayStats(result, stat);
			GameoverScreen.generateScreen(players);
		});

		socket.on("show uno", (username) => {
			if (username != Authentication.getUser().username) {
				GameScreen.showDenyUnoButton();
			}
		});
	};

	const timesUp = function () {
		socket.emit("time");
	};

	return {
		getSocket,
		connect,
		queue,
		timesUp,
	};
})();
