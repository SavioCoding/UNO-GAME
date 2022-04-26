const Game = (function () {
	let context = null;
	let deck = null;

	const parseCards = function (cards) {
		// cards is a list of card object from server
		// returns the sorted list of Card
		let d = [];
		for (let i = 0; i < cards.length; ++i) {
			d.push(new Card(cards[i].number, cards[i].color, cards[i].special));
		}
		return d;
	};

	const renderSelfDeck = function (selfDeck) {
		for (let i = 0; i < selfDeck.length; ++i) {
			let x = i * Card.cardRenderWidth;
			let y = 400;
			selfDeck[i].draw(context, x, y);
		}
	};

	const renderOpponentCard = function (numCards) {
		for (let i = numCards - 1; i >= 0; --i) {
			let x = 800 - i * Card.cardRenderWidth;
			let y = 100;
			let card = new Card(null, null, null);
			card.draw(context, x, y);
		}
	};

	const initialize = function (cards) {
		console.log(cards);
		// assume the cards are sorted
		// cards is a list of {"id":102,"number":8,"special":null,"color":"blue"}
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;

		// *Global var
		deck = parseCards(cards);
		renderSelfDeck(deck);
	};

	return { initialize: initialize, renderOpponentCard: renderOpponentCard };
})();
