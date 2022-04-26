const Socket = (function () {
	let socket = null;
	let firstDraw = true;
	let myOpponentLength = 0;
	const getSocket = function () {
		return socket;
	};

	const connect = function () {
		socket = io();

		socket.on("connect", () => {
			console.log("Connected");
		});
	};

	const queue = function () {
		socket.emit("queue");

		socket.on("start game", () => {
			// TODO: client-side start game things
			WaitingScreen.hide();
			console.log("game started");
		});
	};
	
	const draw_card = function () {
		if(firstDraw == true){
			socket.emit("firstDraw")
			$("#test-button").hide()
			firstDraw = false
		}
		else{
			socket.emit("draw")
		}
		socket.on("firstdrawn", (cardsObject) => {
			let myCards = cardsObject.cards
			let myOpponentLength  = cardsObject.opponentLength
			Game.initialize(myCards);
			if(myOpponentLength==0){
				$("#waiting").show()
			}else{
				socket.emit("Both drawn");
			}
			Game.renderOpponentCard(myOpponentLength);
		})

		// response contains username, cards and opponentLength
		socket.on("card drawn", (cards)=>{
			Game.initialize(cards);
		})

		// opponent drawn
		socket.on("opponent drawn", (opponentLength) => {
			Game.renderOpponentCard(opponentLength);
		})

		socket.on("InitiateTurns",(usernameAndOppolength)=>{

			//me
			if(usernameAndOppolength.myName==Authentication.getUser().username){
				myOpponentLength = usernameAndOppolength.opponentLength;
				Game.renderOpponentCard(usernameAndOppolength.opponentLength);
				$("#test-button").show();
				$("#yourTurn").show();
				$("#waiting").hide();
			}
			// opponent
			else{
				myOpponentLength = usernameAndOppolength.opponentLength;
				Game.renderOpponentCard(usernameAndOppolength.opponentLength);
				$("#test-button").hide();
				$("#yourTurn").hide();
				$("#waiting").show()
			}
		})
	}

	return { getSocket, connect, queue, draw_card };
})();
