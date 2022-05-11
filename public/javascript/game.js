const Game = (function () {
	let context = null;

	const selfCardXstart = 50;
	const selfCardY = 500;
	const opCardX = 850;
	const opCardY = 100;
	const topCardY = 275;
	const topCardX = 420;

	let gameStarted = false;
	let myHand = null;
	let turn = null;
	let top = null;
	let selectedIndex = null;

	const renderState = function (gameState) {
		gameStarted = true;
		const canvas = $("canvas").get(0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (const a in gameState) {
			if (a == "top") {
				top = gameState[a];
				let card = parseCard(top);
				card.draw(context, topCardX, topCardY);
			}
			// my hand
			else if (a == Authentication.getUser().username) {
				myHand = gameState[a];
				let cardX = selfCardXstart;
				for (const c of myHand) {
					let card = parseCard(c);
					card.draw(context, cardX, selfCardY);
					cardX += Card.cardRenderWidth;
				}
			}
			// whose turn is this
			else if (a == "turn") {
				turn = gameState[a];
				if (gameState.turn == Authentication.getUser().username) {
					// my turn
					Timer.startTimer();
					$("#draw-card-button").show();
				} else {
					Timer.pauseTimer();
					$("#draw-card-button").hide();
				}
			}
			// opponent's hand
			else {
				let opDeck = gameState[a];
				let cardX = opCardX;
				for (const c of opDeck) {
					let card = new Card(null, null, null);
					card.draw(context, cardX, opCardY);
					cardX -= Card.cardRenderWidth;
				}
			}
		}
	};

	const parseCard = function (card) {
		return new Card(card.number, card.color, card.special);
	};

	// Add clicking to canvas and check the card, such that this event Handler won't be called again
	// called when use start clicking, pass the position to withinRect and check whether use is clicking on card
	function getCursorPosition(canvas, event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		if (
			y >= selfCardY &&
			y <= selfCardY + Card.cardRenderHeight &&
			x >= selfCardXstart &&
			x <= myHand.length * Card.cardRenderWidth + selfCardXstart
		) {
			const index = Math.floor(
				(x - selfCardXstart) / Card.cardRenderWidth
			);
			playCard(index);
		}
	}

	const initialize = function () {
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;

		// for playing cards
		$("canvas").on("click", (e) => {
			const canvas = document.querySelector("canvas");
			e.stopPropagation();
			e.preventDefault();
			getCursorPosition(canvas, e);
		});

		// for cheat button
		$(document).on("keydown", (e) => {
			if (e.keyCode == 32 && gameStarted) {
				Socket.getSocket().emit("request cheat");
			}
		});
	};

	const drawCard = function () {
		Socket.getSocket().emit("draw card");
	};

	const playCard = function (index) {
		if (turn !== Authentication.getUser().username) {
			alert("Please wait for your turn");
			return;
		}
		const card = myHand[index];
		if (
			(card.color !== null &&
				card.color !== top.color &&
				card.number !== top.number) ||
			(card.color !== null &&
				card.number === null &&
				card.color !== top.color &&
				card.special !== top.special)
		) {
			alert("Invalid Card!");
			return;
		}
		// Valid:
		sounds.use.play();
		if (card.special === "Change color" || card.special === "Add 4") {
			Timer.pauseTimer();
			$("#select-color-overlay").show();
			selectedIndex = index;
			return;
		}
		const returnObj = { index, card };
		Socket.getSocket().emit("play card", JSON.stringify(returnObj));
	};

	const selectColor = function (newColor) {
		const card = myHand[selectedIndex];
		card.color = newColor;
		const returnObj = { index: selectedIndex, card };
		$("#select-color-overlay").hide();
		Socket.getSocket().emit("play card", JSON.stringify(returnObj));
	};

	const affirmUno = function () {
		Socket.getSocket().emit("affirm uno");
	};

	const denyUno = function () {
		Socket.getSocket().emit("deny uno");
	};

	const reset = function () {
		gameStarted = false;
	};

	return {
		initialize: initialize,
		renderState,
		drawCard,
		selectColor,
		affirmUno,
		denyUno,
		reset,
	};
})();
