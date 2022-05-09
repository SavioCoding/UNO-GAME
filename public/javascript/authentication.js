const Authentication = (function () {
	// stores the current signed-in user
	let user = null;
	const getUser = function () {
		return user;
	};

	// send signin request to server
	const login = function (username, password, onSuccess, onError) {
		// prepare user data
		const user1 = {username, password}

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
				} if(json.status=='error'){
					onError(json.error)
				}
			})
			.catch((error) => {
				if (onError) onError(error);
			});
	};

	return { getUser, login };
})();
