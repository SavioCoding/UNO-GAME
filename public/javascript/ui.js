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

	return { hide, initialize };
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
			let cards = [
				{ id: 40, number: null, special: "Add two", color: "green" },
				{ id: 14, number: 0, special: null, color: "yellow" },
				{ id: 19, number: 5, special: null, color: "yellow" },
				{ id: 7, number: 7, special: null, color: "red" },
				{ id: 9, number: 9, special: null, color: "red" },
			];
			Game.initialize(cards);
			Game.renderOpponentCard(cards.length);
		});
	};

	return { initialize };
})();

const UI = (function () {
	const components = [LogInForm, WaitingScreen, GameScreen];

	const initialize = function () {
		for (const component of components) {
			component.initialize();
		}
	};

	return { initialize };
})();
