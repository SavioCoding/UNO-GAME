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
				for (let i = 0; i < 5; i++) {
					let card = util.drawCard(deck);
					players[username].push(card);
				}
				let opponent = Object.entries(players).filter(([key, value]) => key !== username)
				
				cardsObject = {cards: players[username], opponentLength: opponent[0][1].length}
				socket.emit("firstdrawn", cardsObject);
			}
		})

		// draw after first time
		socket.on("draw",()=>{
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				let card = util.drawCard(deck);
				players[username].push(card);
				socket.emit("card drawn", players[username]);

				// send to your opponent but not you
				socket.broadcast.emit("opponent drawn", players[username].length)
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

		// Check if the card is valid
		socket.on("checkCard", (id) => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(lastCard)
				if(lastCard==null){
					socket.emit("cardChecked", {"valid":true, "id":id});
				}else{
					let valid = false
					let currentCard = cards.map((card)=>{ if(card['id'] == id){return card} });

					// if current card is +4 or change color, can always use
					if(currentCard['special'] && !currentCard['color']){
						valid = true
					}
					// last Card is normal card
					else if(!lastCard['special']){
						// other cards with same color
						if(currentCard['color'] === lastCard['color']){
							valid = true
						}
						// currentCard is swap, +2 and banned with not the same color
						else if(!currentCard['number']){
							valid = false
						}
						// normal card
						else if(currentCard['number'] == lastCard['number']){
							valid = true
						}
						// currentCard are other cards, remains valid as false
					}
					// if last card is special, only validn if the color matches
					else{
						if(lastCard['color'] == currentCard['color']){
							valid = true
						}	// remains valid as false if not same color
					}
					socket.emit("cardCheck",{"valid":valid, "id":id});
				}
			}
		})
	});

	const getOpponentLength = (myUsername) => {
		let opponent = Object.entries(players).filter(([key, value]) => key !== myUsername)
		return opponent[0][1].length ? opponent[0][1].length : 0
	}
};
