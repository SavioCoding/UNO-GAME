const Game = (function () {
	let context = null;
	let deck = null;

	const parseCards = function (cards) {
		// cards is a list of card object from server
		// returns the sorted list of Card
		cards.sort(
			(a, b) => a.color.localeCompare(b.color) || b.number - a.number
		);
		let d = [];
		for (let i = 0; i < cards.length; ++i) {
			d.push(new Card(cards[i].number, cards[i].color, cards[i].special));
		}
		return d;
	};

	const renderSelfDeck = function (selfDeck) {
		let i = 0;
		for (let i = 0; i < selfDeck.length; ++i) {
			let x = i * Card.cardRenderWidth;
			let y = 200;
			selfDeck[i].drawSelf(context, x, y);
		}
	};

	const renderOppeonetCard = function (numCards) {};

	const initialize = function (cards) {
		// assume the cards are sorted
		// cards is a list of {"id":102,"number":8,"special":null,"color":"blue"}
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;

		// *Global var
		deck = parseCards(cards);
		renderSelfDeck(deck);
	};

	return { initialize: initialize };
})();
