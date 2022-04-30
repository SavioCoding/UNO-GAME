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

		//a user draw for the first time, draw three cards, and emit the cards drawn to the user 
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

		// If both user finish their first draw, draw a random card and put it in the middle to start
		// Also, select a random user and make it his turn
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

		// User can draw one card after first turn are initialised
		socket.on("draw",()=>{
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				let card = util.drawCard(deck);
				players[username].push(card);
				// if more than ten cards, I lost
				if(players[username].length > 10){
					let opponent = Object.entries(players).filter(([key, value]) => key !== username)
					let opponentName = opponent[0][0]
					console.log(opponent)
					var result  = {}
					result[username] = "lose"
					result[opponentName] = "win"
					util.endGame(result, io)
				}else{
					socket.emit("card drawn", {cards: players[username], number: 1});
					// send to your opponent but not you
					socket.broadcast.emit("opponent drawn", 1)
				}
			}
		})


		// Check if the card is valid
		// by getting back lastCard (the one in the middle of the game field), and comparing with the current card selected
		// One thing to note, in the case where the lastCard is +4 or change color, the lastCard['color'] is the color that the user want to change
		// Therefore, is lastCard['color'] is null, it means it is the first card that being placed in the middle, you can use any card in that case.
		socket.on("checkCard", (id) => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				let valid = false
				let currentCard = util.getCardById(players[username], id);
				// If the first card in the middle is lastCard is +4 or change color, can always use any card
				if(lastCard['special'] && lastCard['color']===null){
					valid = true
				}
				// if current card is +4 or change color, can always use
				else if(currentCard['special'] && currentCard['color']===null){
					valid = true
				}
				// last Card is normal card
				else if(lastCard['special']===null){
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


		// use the card if the card is valid
		socket.on("useCard", (id) => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				
				// get the card I used
				let card = util.getCardById(players[username],id)
				lastCard = card

				// get the cards filtered the used card
				let newCards = util.filterById(players[username], id)
				players[username] = newCards

				// used all card, game over, you win
				if(players[username].length === 0){
					let opponent = Object.entries(players).filter(([key, value]) => key !== username)
					let opponentName = opponent[0][0]
					console.log(opponent)
					var result  = {}
					result[username] = "win"
					result[opponentName] = "lose"
					util.endGame(result, io)
				}else{
					// send to your opponent about old card
					socket.broadcast.emit("opponent used", {"lastCard":lastCard, "special":card["special"]})
					// send the old card id and new deck to yourself
					socket.emit("card used", {"id":id, "cards":players[username], "special":card["special"]});
				}
			}
		})

		// for cases +2/+4, add with the corresponding number
		socket.on("Add cards", (number)=> {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				console.log(username+" is drawing card");
				for (let i = 0; i < number; i++) {
					let card = util.drawCard(deck);
					players[username].push(card);
				}
				// if more than ten cards, I lost
				if(players[username].length > 10){
					let opponent = Object.entries(players).filter(([key, value]) => key !== username)
					let opponentName = opponent[0][0]
					console.log(opponent)
					var result  = {}
					result[username] = "lose"
					result[opponentName] = "win"
					util.endGame(result, io)
				}else{
					socket.emit("card drawn", {cards: players[username], number: number});
					// send to your opponent but not you
					socket.broadcast.emit("opponent drawn", number)
				}
			}
		})

		// set lastCard(+4/change Color) 's color to the color the user want to change
		socket.on("selected color", (color)=>{
			lastCard.color = color
			// send to opponent but not you, such that opponent knows what is the color you changed
			socket.broadcast.emit("opponent changed color", color)
		})

		// if time is up, I lose, end the game
		socket.on("times up", () => {
			if(socket.request.session.user){
				const {username} = socket.request.session.user;
				let opponent = Object.entries(players).filter(([key, value]) => key !== username)
				let opponentName = opponent[0][0]
				console.log(opponent)
				var result  = {}
				result[username] = "lose"
				result[opponentName] = "win"
				util.endGame(result, io)
			}
		})
	});
};
