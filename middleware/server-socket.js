const fs = require("fs");
const util = require("./util");

module.exports = function (app, io) {
	io.on("connection", (socket) => {
		if (socket.request.session.user) {
			const { username } = socket.request.session.user;
			console.log("Socket: " + username + " connected");

			onlineUsers[username] = "some other properties";
		}

		socket.on("queue", () => {
			console.log("Queuing")
			if (socket.request.session.user) {
				const { username } = socket.request.session.user;
				console.log("Socket: added " + username + " to queue");
				players[username] = [];
				if (Object.keys(players).length == 2) {
					io.emit("start game");
					// import and create the deck, store in app.get("deck")
					const jsonData = fs.readFileSync("./data/cards.json");
					const cards = JSON.parse(jsonData);
					deck = cards;
					// TODO: server-side start the game
					console.log("game started " + JSON.stringify(players));
				}
			}
		});
		

		//draw for first time
		socket.on("firstDraw",()=>{
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				for (let i = 0; i < 5; i++) {
					let card = util.drawCard(deck);
					players[username].push(card);
				}
				let opponent = Object.entries(players).filter(([key, value]) => key !== username)
				
				cardsObject = {cards: players[username], opponentLength: opponent[0][1].length}
				socket.emit("firstdrawn", cardsObject);
			}
		})

		socket.on("draw",()=>{
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				let card = util.drawCard(deck);
				players[username].push(card);
				socket.emit("card drawn", players[username]);
			}
		})

		// Finished drawing five cards
		socket.on("Both drawn",()=>{
			if(socket.request.session.user){
				var keys = Object.keys(players);
				let currentPlayerName = keys[ Math.floor(Math.random() * 2)];
				io.emit("InitiateTurns", {myName: currentPlayerName, opponentLength: 5});
			}
		})
	});
};
