const fs = require("fs");
const session = require("express-session");

module.exports = function (app) {
	const gameSession = session({
		secret: "uno",
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: { maxAge: 300000 },
	});

	app.use(gameSession);

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
