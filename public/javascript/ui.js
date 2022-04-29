const LogInForm = (function () {
	const initialize = function () {
		$("#login-form").on("submit", (e) => {
			e.preventDefault();
			const username = $("#login-username").val().trim();
			Authentication.login(
				username,
				() => {
					Socket.connect();
					$("#match-button").show();
					$("#login-overlay").hide();
				},
				(error) => {
					console.log(error);
				}
			);
		});

		$("#match-button").on("click", () => {
			Matching.startMatch(
				Authentication.getUser().username,
				() => {
					Socket.queue();
					// TODO: client side show the waiting screen
					$("#match-button").hide();
					$("#wait-screen").append(
						"<h1>Waiting for another player to join...</h1>"
					);
				},
				(error) => {
					// TODO: client side display error message
					console.log("matching error: " + error);
				}
			);
		});
	};
	return { initialize };
})();

const WaitingScreen = (function () {
	let waitingScreen = null;

	const initialize = function () {
		waitingScreen = $("#wait-screen");
	};

	const hide = function () {
		// TODO: add countdown
		waitingScreen.fadeOut(500);
	};

	const show = function () {
		waitingScreen.fadeIn(500);
	};

	return { hide, initialize, show };
})();

const SelectColorScreen = (function () {
	let selectColorScreen = null;
	let redHandler = null;
	let greenHandler = null;
	let blueHandler = null;
	let yellowHandler = null;
	const initialize = function () {
		selectColorScreen = $("#select-color-screen");
		selectColorScreen.hide();
		redHandler = $("#red").on("click", () => {
			Socket.changeColor("red");
		});
		greenHandler = $("#green").on("click", () => {
			Socket.changeColor("green");
		});
		blueHandler = $("#blue").on("click", () => {
			Socket.changeColor("blue");
		});
		yellowHandler = $("#yellow").on("click", () => {
			Socket.changeColor("yellow");
		});
	};

	const hide = function () {
		// TODO: add countdown
		selectColorScreen.fadeOut(500);
	};

	const show = function () {
		selectColorScreen.fadeIn(500);
	};

	return { hide, initialize, show };
})();



const GameScreen = (function () {
	let cv = null;
	let context = null;
	let card = null;
	let gameScreen = null;
	const initialize = function () {
		gameScreen = $("#game-container");
		cv = $("canvas").get(0);
		context = cv.getContext("2d");
		context.imageSmoothingEnabled = false;
		$("#test-button").on("click", () => {
			Socket.draw_card();
		});
	};

	const hide = function () {
		// TODO: add countdown
		gameScreen.fadeOut(500);
	};

	const show = function () {
		gameScreen.fadeIn(500);
	};

	return { initialize, hide, show };
})();

const GameoverScreen = (function () {
	let leaderboard = null;

	const initialize = function () {
		leaderboard = $("#leaderboard-body");

		$("#quit-button").on("click", () => {
			hide();
			$("#leaderboard-overlay").css("display", "none");
			WaitingScreen.show();
			leaderboard.empty();
		});

		$("#next-button").on("click", () => {
			$("#game-stat-container").slideUp();
			$("#leaderboard-container").slideDown();
		});
	};

	const displayStats = function (result, stat) {
		// result: 'win or lose'
		// stat: {"special card played": 1, "time used": 1, score: 1}
		let statArr = [
			stat["special card played"],
			stat["time used"],
			stat.score,
		];

		for (let i = 0; i < $("#game-stat tbody td").length; ++i) {
			$("#game-stat tbody td")[i].innerHTML = toString(statArr[i]);
		}

		$("#game-stat-container").show();
	};

	const generateScreen = function (playerData) {
		// result: 'win or lose', players: list of {gamertag, high score}
		for (let i = 0; i < playerData.length; ++i) {
			let tag = playerData[i].gamertag;
			let score = playerData[i].score;
			console.log("hi");
			leaderboard.append(
				$(
					"<tr><td>" +
						i +
						"</td>" +
						"<td>" +
						tag +
						"</td>" +
						"<td>" +
						score +
						"</td></tr>"
				)
			);
		}
		$("#gameover-overlay").css("display", "flex");
	};

	const hide = function () {
		$("#gameover-overlay").fadeOut(500);
	};

	return { initialize, generateScreen, displayStats };
})();

const UI = (function () {
	const components = [
		LogInForm,
		WaitingScreen,
		GameScreen,
		GameoverScreen,
		SelectColorScreen,
	];

	const initialize = function () {
		for (const component of components) {
			component.initialize();
		}
	};

	return { initialize };
})();
