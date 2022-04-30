const Game = (function () {
	let context = null;
	let deck = null;
	
	// js object (coordinates to id for cards that I have)
	let XYToid = {}

	// store card id if the card is valid and clicked once
	let checkedCard = null;

	// check if you are in current turn, such that you are not allowed to use the card if it is not your turn
	let yourTurn = false;

	// last Card
	let lastCard = null;

	const changeTurn = (turn) => {
		yourTurn = turn
	}

	// set the valid checked card id to the variable checked card
	const changeCheckedCard = (id) => {
		checkedCard = id
	}

	const parseCards = function (cards) {
		// cards is a list of card object from server
		// returns the sorted list of Card
		let d = [];
		for (let i = 0; i < cards.length; ++i) {
			d.push(new Card(cards[i].id, cards[i].number, cards[i].color, cards[i].special));
		}
		return d;
	};

	// render the deck and add (coordinates to ID) to the dictioanry XYtoid
	const renderSelfDeck = function (selfDeck) {
		for (let i = 0; i < selfDeck.length; ++i) {
			let x = i * Card.cardRenderWidth;
			let y = 400;
			let cardId = selfDeck[i].id;
			coordinates = x.toString() + "," + y.toString()
			XYToid[coordinates] = cardId;
			selfDeck[i].draw(context, x, y);
		}
	};


	// render the number of cards of the opponents
	const renderOpponentCard = function (numCards) {
		context.clearRect(0, 100, 1000, Card.cardRenderHeight);
		for (let i = numCards - 1; i >= 0; --i) {
			let x = 800 - i * Card.cardRenderWidth;
			let y = 100;
			let card = new Card(null, null, null, null);
			card.draw(context, x, y);
		}
	};

	// when you use a card and put it in the middle of the field
	const useCardAndPut = function (id, cards) {
		for (let i = 0; i < deck.length; ++i) {
			let x = i * Card.cardRenderWidth;
			let y = 400;
			let cardId = deck[i].id;
			if(cardId === id){
				context.clearRect(0, y, 1000, Card.cardRenderHeight);
				lastCard = deck[i]
				lastCard.draw(context, 400, 250);
				deck = parseCards(cards);
				renderSelfDeck(deck);
				break;
			}
		}
	}

	// put a card in the middle at the beginning
	const PutCard = function (card) {
		lastCard = new Card(card.id, card.number, card.color, card.special);
		lastCard.draw(context, 400, 250);
	}

	// called this if want to load the cards after the first draw
	const loadCards = function (cards) {
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;
		deck = parseCards(cards);
		renderSelfDeck(deck);
	}

	// called only once, so that the event listener won't be added again
	const initialize = function (cards) {
		// assume the cards are sorted
		// cards is a list of {"id":102,"number":8,"special":null,"color":"blue"}
		loadCards(cards)


		// check whether the coordinates I am clicking is on a card
		// return the id of the card
		// return -1 if not clicking on a card
		const withinRect = (x, y) => {
			for (key in XYToid){
				let coordinates = key.split(",");
				let cardX = parseInt(coordinates[0])
				let cardY = parseInt(coordinates[1])
				if(x>=cardX && x<=cardX+Card.cardRenderWidth && y>=cardY && y<=cardY+Card.cardRenderHeight){
					return XYToid[key]
				}
			}
			return -1;
		}

		// Add clicking to canvas and check the card, such that this event Handler won't be called again
		// called when use start clicking, pass the position to withinRect and check whether use is clicking on card
		function getCursorPosition(canvas, event) {
			const rect = canvas.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			let id = withinRect(x, y)
			if(yourTurn === true){
				// user clicks on card
				if(id !== -1){
					// user click the same valid card again, use the card
					if(checkedCard!==null && checkedCard===id){
						Socket.useCard(id)
						$("#validCard").hide();
					}
					// click for first time, check if it is a valid card
					else{
						Socket.checkCard(id);
					}
				// user does not click on a card
				}else{
					checkedCard = null;
					$("#inValidCard").hide()
					$("#validCard").hide()
					$("#selectCard").show()
				}
			}
		}

		const canvas = document.querySelector('canvas')
		// called clicking event
		canvas.addEventListener("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			getCursorPosition(canvas, e)
		})
	};

	return { initialize: initialize, renderOpponentCard: renderOpponentCard, changeTurn, changeCheckedCard, useCardAndPut, PutCard, loadCards};
})();
