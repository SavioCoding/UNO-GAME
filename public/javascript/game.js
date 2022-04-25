const Game = (function () {
	let context = null;

	const renderSelfCard = function (card, x) {
		// card is an object {"id":102,"number":8,"special":null,"color":"blue"}
		card = new Card(card.number, card.color, card.special);
		let y = 100;
		card.draw(context, x, y);
		return card;
	};

	const renderOppeonetCard = function (numCards) {};

	const initialize = function (cards) {
		// assume the cards are sorted
		// cards is a list of {"id":102,"number":8,"special":null,"color":"blue"}
		context = $("canvas").get(0).getContext("2d");
		context.imageSmoothingEnabled = false;

		cards.sort(
			(a, b) => a.color.localeCompare(b.color) || b.number - a.number
		);

		// *Global var
		deck = cards;
		for (let i = 0; i < deck.length; ++i) {
			deck[i] = renderSelfCard(deck[i], i * Card.cardRenderWidth);
		}
	};

	return { initialize: initialize };
})();
