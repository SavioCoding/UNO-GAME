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
					$("#wait-message").show();
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

// input: time in seconds
// output: formated string of time in mm:ss
function formatTime(time) {
	let min = Math.floor(time / 60);
	min = min.toString();
	min = min.length == 2 ? min : "0" + min;

	let sec = time % 60;
	sec = sec.toString();
	sec = sec.length == 2 ? sec : "0" + sec;
	return min + ":" + sec;
}

const GameScreen = (function () {
	// input: time remaining in seconds
	// this function will transform seconds into mm:ss
	const updateTimer = function (timeLeft) {
		$("#timer").text(formatTime(timeLeft));
	};

	return { updateTimer };
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
		const timeUsed = Timer.getTimeUsed();
		let statArr = [
			stat["numSpecialCards"],
			formatTime(timeUsed),
			stat["score"],
		];

		for (let i = 0; i < $("#game-stat tbody td").length; ++i) {
			$("#game-stat tbody td")[i].innerHTML = statArr[i];
		}

		if (result === "win") {
			$("#result-textbox").text("You Win!");
			// TODO: play victory sounds
		} else if (result === "lose") {
			$("#result-textbox").text("You Lose :(");
			// TODO: play sad music
		}
		// tie
		else {
			$("#result-textbox").text("It's a Tie");
		}
		$("#game-stat-container").show();
	};

	const generateScreen = function (playerData) {
		// result: 'win or lose', players: list of {gamertag, high score}
		for (let i = 0; i < playerData.length; ++i) {
			let tag = playerData[i].gamertag;
			let score = playerData[i].highscore;
			leaderboard.append(
				$(
					"<tr><td>" +
						(i + 1) +
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
	const components = [LogInForm, WaitingScreen, GameoverScreen];

	const initialize = function () {
		for (const component of components) {
			component.initialize();
		}
		Game.initialize();
	};

	return { initialize };
})();
