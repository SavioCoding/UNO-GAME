const Socket = (function () {
	let socket = null;

	// a gate for determining 1st draw or later draws
	let firstDraw = true;

	// number of cards remaining in the opponent's deck
	let myOpponentLength = 0;

	const getSocket = function () {
		return socket;
	};


	const connect = function () {
		socket = io();

		socket.on("connect", () => {
			console.log("Connected");
		});

		/*
		It is the first time the users draw the card, server send the cards drawn back to user, 
		wait if the opponet still drawing, else send to the server than both are drawn,
		such that server can choose which player starts first
		*/
		socket.on("firstdrawn", (cardsObject) => {
			let myCards = cardsObject.cards;
			let myOpponentLength = cardsObject.opponentLength;
			Game.initialize(myCards);
			if (myOpponentLength == 0) {
				$("#waiting").show();
			} else {
				socket.emit("Both drawn");
			}
			Game.renderOpponentCard(myOpponentLength);
		});

		/* At the first turn, server received socket.emit("Both drawn") from socket.on("firstdrawn"),
		It decide which player to start first randomly, io.emit("InitiateTurns") is called from server. In the response
		passed, there is the name and this name determine which user to start first.
		*/
		socket.on("InitiateTurns", (res) => {
			// It is my turn now
			if (res.myName == Authentication.getUser().username) {
				myOpponentLength = res.opponentLength;
				Game.renderOpponentCard(res.opponentLength);
				$("#test-button").show();
				$("#yourTurn").show();
				$("#waiting").hide();
				Game.changeTurn(true);
				Timer.startTimer();
			}
			// It is opponent's turn now
			else {
				myOpponentLength = res.opponentLength;
				Game.renderOpponentCard(res.opponentLength);
				$("#test-button").hide();
				$("#yourTurn").hide();
				$("#waiting").show();
			}
			Game.PutCard(res.lastCard);
			$("#timer").show();
		});

		/* Card is being checked in the server, user then know if the card is
		valid or not from this function, if it is valid, put the checked card's
		id in Game.checkedCard variable, so that if it is clicked again, 
		use card will be used
		*/
		socket.on("cardChecked", (res) => {
			if (res["valid"]) {
				Game.changeCheckedCard(res["id"]);
				$("#invalidCard").hide();
				$("#validCard").show();
			} else {
				$("#validCard").hide();
				$("#invalidCard").show();
			}
		});

		/* Current user draw a card (not the first turn) or from opponent's +2/+4
		the remaining deck is sent back, the current user then render the remaining
		deck in his UI, it is opponent's turn if I draw it, it is my turn if opponent
		use +2/+4 on me. (+4 is not included here as the changed turn is handled
		when changing color)
		*/
		socket.on("card drawn", (res) => {
			Game.initialize(res["cards"]);
			// normal draw
			if (res.number == 1) {
				changeToOpponentTurn();
				// +2 or +4
			} else if (res.number == 2){
				changeToMyTurn();
			}
			$("#changeColor").hide();
		});

		/* The opponent draw a card (not the first turn) or from opponent's +2/+4,
		the number of cards the opponent drawn is sent back and rendered.
		If opponent draw 1, it becomes my turn
		If I use +2/+4 on my opponent, it becomes my opponent's turn
		(+4 is not included here as the changed turn is handled
		when changing color)
		*/
		socket.on("opponent drawn", (number) => {
			myOpponentLength += number;
			Game.renderOpponentCard(myOpponentLength);
			console.log(myOpponentLength);
			// normal draw
			if (number == 1) {
				changeToMyTurn();
				// cases with +2 or +4
			} else if (number == 2) {
				changeToOpponentTurn();
			}
		});

		/* I used a card
		call useCardAndPut() to put the card in the middle of the gameboard
		If it is Ban/Swap, it is my turn again
		If it is change color or add 4, let the user to pick the color
		If it is a normal card, change the turn to your opponent
		If it is add 2, do nothing, as opponent drawn/ card drawn will handle it
		*/
		socket.on("card used", (res) => {
			Game.useCardAndPut(res["id"], res["cards"]);
			if (res["special"] === "Ban" || res["special"] === "Swap") {
				changeToMyTurn();
			} else if (res["special"] === "Change color" || res["special"] === "Add 4") {
				GameScreen.hide();
				SelectColorScreen.show();
			} else if (res["special"] === null) {
				changeToOpponentTurn();
			}
			$("#changeColor").hide();
		});

		/*
		Opponent use a card
		call useCardAndPut() to put the card in the middle of the gameboard
		If it is an add 2 or add 4, add the corresponding number of cards to me
		If it is Ban/Swap, it is opponent's turn again
		If it is a normal card, change to my turn now
		*/
		socket.on("opponent used", (res) => {
			Game.PutCard(res["lastCard"]);
			myOpponentLength -= 1;
			Game.renderOpponentCard(myOpponentLength);
			if (res["special"] === "Add two") {
				socket.emit("Add cards", 2);
			}
			else if(res["special"]==="Add 4"){
				socket.emit("Add cards", 4)
			}
			else if (res["special"] === "Ban" || res["special"] === "Swap") {
				changeToOpponentTurn();
			} else if(res["special"] === null) {
				changeToMyTurn();
			}
		});

		/* opponent changed color (+4/change color)
		The server sent me the color that opponent changed from (+4/change color)
		Show the corresponding message and changed to my turn
		*/
		socket.on("opponent changed color", (color) => {
			$("#changeColor").text(
				"Your opponent changed the color to " + color
			);
			$("#changeColor").show();
			changeToMyTurn();
		});
	};

	const queue = function () {
		socket.emit("queue");

		socket.on("start game", () => {
			// TODO: client-side start game things
			WaitingScreen.hide();
			console.log("game started");
		});

		socket.on("gameover", (gameOutcome) => {
			// remove game related listeners
			socket.off("start game");
			// TODO: other listeners such as draw cards etc.
			// gameOutcome = {result: {tony:'win', may:'lose'}, players: [{gamertag, highscore}], stat:{tony: {"special card played": ...}}}
			GameScreen.hide();
			gameOutcome = JSON.parse(gameOutcome);
			console.log(gameOutcome);
			const result =
				gameOutcome.result[Authentication.getUser().username]; //win or lose
			// const stat = gameOutcome.stat[Authentication.getUser().username];
			console.log("Gameover " + result);
			// GameoverScreen.displayStats(result, stat);
			GameoverScreen.generateScreen(gameOutcome.players);
		});
	};

	/* the draw card button call this function, 
	use variable firstDraw to determine whether this is actually the first time to draw */
	const draw_card = function () {
		if (firstDraw == true) {
			socket.emit("firstDraw");
			$("#test-button").hide();
			firstDraw = false;
		} else {
			socket.emit("draw");
		}
	};

	/* If it is the first time to press the card, emit the checkCard event to the server */
	const checkCard = function (id) {
		socket.emit("checkCard", id);
	};

	/* Use the card if the card is valid */
	const useCard = function (id) {
		socket.emit("useCard", id);
	};

	/* The opponent finished his turn and 
	it is my turn now */
	// By changing button and displaying message
	const changeToMyTurn = function () {
		$("#yourTurn").show();
		$("#waiting").hide();
		$("#test-button").show();
		Game.changeTurn(true);
		Game.changeCheckedCard(null);
		Timer.startTimer();
	};

	/* I finished my turn and it is opponent's turn */
	// By changing button and displaying message
	const changeToOpponentTurn = function () {
		$("#yourTurn").hide();
		$("#waiting").show();
		$("#test-button").hide();
		$("#validCard").hide();
		$("#invalidCard").hide();
		Game.changeTurn(false);
		Game.changeCheckedCard(null);
		Timer.stopTimer();
	};

	/* the red/green/blue/yellow buttons called it (For +4/change color),
	such and this function notify the server which color
	the current user want to change, then change to opponent's turn 
	after selecting the color
	*/
	const changeColor = (color) => {
		SelectColorScreen.hide();
		GameScreen.show();
		socket.emit("selected color", color);
		changeToOpponentTurn();
	};

	/* called from timer.js to inform the server that time is up and game is over */
	const timesUp = () => {
		socket.emit("times up")
	}

	return {
		getSocket,
		connect,
		queue,
		draw_card,
		checkCard,
		useCard,
		changeColor,
		timesUp
	};
})();
