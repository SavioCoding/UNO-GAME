const Socket = (function () {
	let socket = null;

	// a gate for determining 1st draw or later draws
	let firstDraw = true;

	// number of cards remaining in the opponent's deck
	let myOpponentLength = 0;

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
	};

	return {
		getSocket,
		connect,
		queue,
	};
})();
