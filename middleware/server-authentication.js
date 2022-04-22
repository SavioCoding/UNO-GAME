const fs = require("fs");
module.exports = function (app) {
	console.log("export");
	app.post("/login", (req, res) => {
		const { username } = req.body;
		const jsonData = fs.readFileSync("./data/users.json");
		const users = JSON.parse(jsonData);
		console.log(req.session);

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
};
