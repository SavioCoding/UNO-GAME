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
					const jsonData = fs.readFileSync("./data/only_special_cards.json");
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
				for (let i = 0; i < 3; i++) {
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
				socket.emit("card drawn", {cards: players[username], number: 1});
				// send to your opponent but not you
				socket.broadcast.emit("opponent drawn", 1)
			}
		})

		// Finished drawing five cards, draw one card and put the card into the middle
		socket.on("Both drawn",()=>{
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				let card = util.drawCard(deck)
				lastCard = card;
				var keys = Object.keys(players);
				let currentPlayerName = keys[ Math.floor(Math.random() * 2)];
				io.emit("InitiateTurns", {myName: currentPlayerName, opponentLength: players[username].length, lastCard: lastCard});
			}
		})

		// Check if the card is valid
		socket.on("checkCard", (id) => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				let valid = false
				let currentCard = util.getCardById(players[username], id);
				console.log(currentCard, lastCard)
				// if current card is +4 or change color, can always use
				if(currentCard['special'] && currentCard['color']===null){
					valid = true
					console.log("1st")
				}
				// last Card is normal card
				else if(lastCard['special']===null){
					console.log("2nd")
					// other cards with same color
					if(currentCard['color'] === lastCard['color']){
						valid = true
					}
					// currentCard is swap, +2 and banned with not the same color
					else if(currentCard['number']===null){
						valid = false
					}
					// normal card
					else if(currentCard['number'] === lastCard['number']){
						valid = true
					}
					// currentCard are other cards, remains valid as false
				}
				// if last card is special, only valid if the color matches, or both have same special
				else{
					console.log("3rd")
					if(lastCard['color'] === currentCard['color']){
						valid = true
					}
					else if(lastCard['special'] === currentCard['special']){
						valid = true
					}	
					// remains valid as false if not same color
				}
				socket.emit("cardChecked",{"valid":valid, "id":id});
			}
		})
		socket.on("useCard", (id) => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				
				let card = util.getCardById(players[username],id)
				lastCard = card

				let newCards = util.filterById(players[username], id)
				players[username] = newCards

				// send to your opponent about old card
				socket.broadcast.emit("opponent used", {"lastCard":lastCard, "special":card["special"]})
				// send the old card id and new deck to yourself
				socket.emit("card used", {"id":id, "cards":players[username], "special":card["special"]});
			}
		})

		socket.on("Add cards", (number)=> {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				for (let i = 0; i < number; i++) {
					let card = util.drawCard(deck);
					players[username].push(card);
				}
				socket.emit("card drawn", {cards: players[username], number: number});
				// send to your opponent but not you
				socket.broadcast.emit("opponent drawn", number)
			}
		})

		socket.on("selected color", (color)=>{
			lastCard.color = color
			socket.broadcast.emit("opponent changed color", color)
		})
	});
};
