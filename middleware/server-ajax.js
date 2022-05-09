const fs = require("fs");
const bcrypt = require("bcrypt");

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

	app.post("/register", (req, res) => {
		// Get the JSON data from the body
		let { username, name, password } = req.body;
	
		//
		// D. Reading the users.json file
		//
		const users = JSON.parse(fs.readFileSync("data/users.json"))
		//
		// E. Checking for the user data correctness
		//
		// case 1
		if (!username || !name || !password){
			res.json({ status: "error", error: "Fields cannot be empty"})
		}
		// case 3
		else if(username in users){
			res.json({ status: "error", error: "The user already exists. "})
		}else{
			const hash = bcrypt.hashSync(password, 10)
			password = hash
			highscore = 0;
			console.log(username+" registered.");
			let gamertag = name
			users[username] = {gamertag, password, highscore}
	
			fs.writeFileSync("data/users.json", JSON.stringify(users, null, " ") )
			res.json({ status: "success"})
		}
	});


};
