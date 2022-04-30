const fs = require("fs");

const jsonData = fs.readFileSync("./data/cards.json");
let allCards = JSON.parse(jsonData);

const drawCard = function () {
	return allCards[Math.floor(Math.random() * allCards.length)];
};

const startGame = function (io, gameState) {
	console.log("start");
	// randomly assigning 3 cards to each player
	for (let i = 0; i < players.length; ++i) {
		for (let j = 0; j < 3; ++j) {
			gameState[players[i]].push(drawCard());
		}
	}
	// randomly assigning a top card that is not special
	while (true) {
		let candidate = drawCard();
		if (candidate.special == null) {
			gameState.top = candidate;
			break;
		}
	}
	// tell client side to render cards
	io.emit("game state", JSON.stringify(gameState));
};

module.exports = { startGame };
