const Matching = (function () {
	const startMatch = function (username, onSuccess, onError) {
		const jsonData = JSON.stringify({ username });

		fetch("/match", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: jsonData,
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.status == "success") {
					onSuccess(json.success);
				} else if (onError) {
					onError(json.error);
				}
			})
			.catch((error) => {
				if (onError) onError(error);
			});
	};

	return { startMatch };
})();
