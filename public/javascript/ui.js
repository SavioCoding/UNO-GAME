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

const GameScreen = (function () {
	let cv = null;
	let context = null;
	let card = null;
	const initialize = function () {
		cv = $("canvas").get(0);
		context = cv.getContext("2d");
		context.imageSmoothingEnabled = false;
		$("#test-button").on("click", () => {
			Socket.draw_card();
		});
	};

	return { initialize };
})();

const GameoverScreen = (function () {
	let leaderboard = null;

	const initialize = function () {
		leaderboard = $("#leaderboard-body");

		$("#quit-button").on("click", () => {
			hide();
			WaitingScreen.show();
			leaderboard.empty();
		});
	};

	const generateScreen = function (result, playerData) {
		// result: 'win or lose', players: list of {gamertag, high score}
		$("#result-textbox").text("You " + result);

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

	return { initialize, generateScreen };
})();

const UI = (function () {
	const components = [LogInForm, WaitingScreen, GameScreen, GameoverScreen];

	const initialize = function () {
		for (const component of components) {
			component.initialize();
		}
	};

	return { initialize };
})();
