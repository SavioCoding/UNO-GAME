const Game = (function () {
	let context = null;
	let deck = null;

	// check if cards are initialized for first time
	let first = true;

	// js object (coordinates to id)
	let XYToid = {};

	// store card id if the card is valid and clicked once
	let checkedCard = null;

	// check if you are in current turn, such that you are not allowed to use the card if it is not your turn
	let yourTurn = false;

	// last Card
	let lastCard = null;

	// changedColor (+4 or change color)
	let changedColor = null;

	let socket = null;

	const selfCardXstart = 0;
	const selfCardY = 400;
	const opCardX = 500;
	const opCardY = 50;
	const topCardY = 200;
	const topCardX = 300;

	let myHand = null;
	let turn = null;
	let top = null;
	let selectedIndex = null;

	const renderState = function (gameState) {
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
					$("#draw-card-button").show();
					Timer.startPauseTimer();
				} else {
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
					cardX += Card.cardRenderWidth;
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
		// for drawing cards
		$("#draw-card-button").on("click", () => {
			drawCard();
		});

		// for playing cards
		$("canvas").on("click", (e) => {
			const canvas = document.querySelector("canvas");
			e.stopPropagation();
			e.preventDefault();
			getCursorPosition(canvas, e);
		});

		// for cheat button
		$(document).on("keydown", (e) => {
			if (e.keyCode == 32) {
				Socket.getSocket().emit("request cheat");
			}
		});
	};

	const drawCard = function () {
		Socket.getSocket().emit("draw card");
		// pause timer
		Timer.startPauseTimer();
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
		Timer.startPauseTimer(); // pause timer
		if (card.special === "Change color" || card.special === "Add 4") {
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

	return {
		initialize: initialize,
		renderState,
		selectColor,
		affirmUno,
		denyUno,
	};
})();
