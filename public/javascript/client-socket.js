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

		// opponent drawn
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

		// current User drawn
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

		socket.on("InitiateTurns", (res) => {
			//me
			if (res.myName == Authentication.getUser().username) {
				myOpponentLength = res.opponentLength;
				Game.renderOpponentCard(res.opponentLength);
				$("#test-button").show();
				$("#yourTurn").show();
				$("#waiting").hide();
				Game.changeTurn(true);
				Timer.startTimer();
			}
			// opponent
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

		// I used the card
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

		// opponent use the card
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
			} else if(res["special"] !== null) {
				changeToMyTurn();
			}
		});

		// opponent changed color
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

	const draw_card = function () {
		if (firstDraw == true) {
			socket.emit("firstDraw");
			$("#test-button").hide();
			firstDraw = false;
		} else {
			socket.emit("draw");
		}
	};

	const checkCard = function (id) {
		socket.emit("checkCard", id);
	};

	const useCard = function (id) {
		socket.emit("useCard", id);
	};

	const changeToMyTurn = function () {
		$("#yourTurn").show();
		$("#waiting").hide();
		$("#test-button").show();
		Game.changeTurn(true);
		Game.changeCheckedCard(null);
		Timer.startTimer();
	};

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

	// for case with change color or +4
	const changeColor = (color) => {
		SelectColorScreen.hide();
		GameScreen.show();
		socket.emit("selected color", color);
		changeToOpponentTurn();
	};

	return {
		getSocket,
		connect,
		queue,
		draw_card,
		checkCard,
		useCard,
		changeColor,
	};
})();
