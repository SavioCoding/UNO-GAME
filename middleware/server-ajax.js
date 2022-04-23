const fs = require("fs");

module.exports = function (app) {
	app.post("/login", (req, res) => {
		const { username } = req.body;
		const jsonData = fs.readFileSync("./data/users.json");
		const users = JSON.parse(jsonData);

		if (!(String(username) in users)) {
			res.json({
				status: "error",
				error: "User does not exist",
			});
			return;
		}

		// successful login
		console.log("someone logged in");
		req.session.user = {
			username,
		};
		res.json({
			status: "success",
			user: req.session.user,
		});
	});

	app.post("/match", (req, res) => {
		const { username } = req.body;
		console.log("AJAX: " + username + " request to match");

		// cannot play if two players are already playing
		if (Object.keys(players).length == 2) {
			res.json({
				status: "error",
				error: "there are already two players playing, please wait",
			});
			return;
		}

		res.json({
			status: "success",
		});
	});
};
