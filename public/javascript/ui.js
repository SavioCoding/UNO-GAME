const LogInForm = (function () {
	const initialize = function () {
		$("#login-form").on("submit", (e) => {
			e.preventDefault();
			const username = $("#login-username").val().trim();
			Authentication.login(
				username,
				() => {
					Socket.connect();
				},
				(error) => {
					console.log(error);
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
