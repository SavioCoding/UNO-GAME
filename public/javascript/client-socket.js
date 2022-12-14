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
			sounds.wait.pause();
			sounds.wait.currentTime = 0;
			gameState = JSON.parse(gameState);
			Game.renderState(gameState);
			WaitingScreen.hide();
		});

		socket.on("cheated", (cheatingPlayer) => {
			if (Authentication.getUser().username != cheatingPlayer) {
				Timer.reduceInterval();
			}
		});

		socket.on("gameover", (gameOutcome) => {
			// gameOutcome = {result: {tony:'win', may:'lose'}, players: [{gamertag, highscore}], stat:{tony: {"special card played": ...}}}
			let { result, players, stat } = JSON.parse(gameOutcome);
			result = result[Authentication.getUser().username]; //win or lose or tie
			stat = stat[Authentication.getUser().username];
			GameoverScreen.displayStats(result, stat);
			GameoverScreen.generateScreen(players);

			// remove game related listeners
			socket.off("game state");
			socket.off("gameover");
			socket.off("cheated");
			socket.off("show uno");
			socket.off("hide uno");
			Timer.reset();
			Game.reset();
		});

		socket.on("show uno", (username) => {
			Timer.pauseTimer();
			if (username == Authentication.getUser().username) {
				GameScreen.showAffirmUnoButton();
			} else {
				GameScreen.showDenyUnoButton();
			}
		});

		socket.on("hide uno", () => {
			GameScreen.hideUnoButton();
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
