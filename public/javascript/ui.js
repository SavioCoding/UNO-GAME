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
				},
				(error) => {
					console.log(error);
				}
			);
		});

		$("#match-button").on("click", () => {
			Matching.startMatch(
				Authentication.getUser().username,
				(successMsg) => {
					if (successMsg == "queue") {
						console.log("waiting for another player");
						Socket.queue();
					} else {
						console.log("start game");
					}
				},
				(error) => {
					console.log("matching error: " + error);
				}
			);
		});
	};
	return { initialize };
})();

const UI = (function () {
	const components = [LogInForm];

	const initialize = function () {
		for (const component of components) {
			component.initialize();
		}
	};

	return { initialize };
})();
