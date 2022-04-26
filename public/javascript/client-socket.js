const Socket = (function () {
	let socket = null;
	let firstDraw = true;
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
			$("#waiting").hide();
			$("#yourTurn").hide();
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
			console.log(cardsObject)
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

		socket.on("InitiateTurns",(usernameAndOppolength)=>{
			if(usernameAndOppolength.myName==Authentication.getUser().username){
				Game.renderOpponentCard(usernameAndOppolength.opponentLength)
				$("#test-button").show();
				$("#yourTurn").show();
				$("#waiting").hide();
			}
			// opponent
			else{
				Game.renderOpponentCard(usernameAndOppolength.opponentLength)
				$("#test-button").hide();
				$("#yourTurn").hide();
				$("#waiting").show()
			}

		})
	}

	return { getSocket, connect, queue, draw_card };
})();
