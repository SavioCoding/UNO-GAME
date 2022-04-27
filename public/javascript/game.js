const Game = (function () {
	let context = null;
	let deck = null;

	// check if user can user the card
	let canUse = false;
	
	// js object (coordinates to id)
	let XYToid = {}

	const parseCards = function (cards) {
		// cards is a list of card object from server
		// returns the sorted list of Card
		let d = [];
		for (let i = 0; i < cards.length; ++i) {
			d.push(new Card(cards[i].id, cards[i].number, cards[i].color, cards[i].special));
		}
		return d;
	};

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

	const renderOpponentCard = function (numCards) {
		for (let i = numCards - 1; i >= 0; --i) {
			let x = 800 - i * Card.cardRenderWidth;
			let y = 100;
			let card = new Card(null, null, null, null);
			card.draw(context, x, y);
		}
	};
	
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

	const initialize = function (cards) {
		// assume the cards are sorted
		// cards is a list of {"id":102,"number":8,"special":null,"color":"blue"}
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;

		// *Global var
		deck = parseCards(cards);
		renderSelfDeck(deck);

		// Add clicking to canvas and check the card
		function getCursorPosition(canvas, event) {
			const rect = canvas.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			let id = withinRect(x, y)
			if(id != -1){
				Socket.checkCard(id);
			}
		}

		const canvas = document.querySelector('canvas')
		canvas.addEventListener('mousedown', function(e) {
			getCursorPosition(canvas, e)
		})
	};

	return { initialize: initialize, renderOpponentCard: renderOpponentCard };
})();
