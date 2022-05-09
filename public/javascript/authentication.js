const Authentication = (function () {
	// stores the current signed-in user
	let user = null;
	const getUser = function () {
		return user;
	};

	// send signin request to server
	const login = function (username, onSuccess, onError) {
		// prepare user data
		const user1 = {username}

		// send AJAX request to server
		fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user1),
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.status == "success") {
					console.log("login successful");
					user = json.user;
					onSuccess();
				} else if (onError) {
					onError(json.onError);
				}
			})
			.catch((error) => {
				if (onError) onError(error);
			});
	};

	return { getUser, login };
})();
