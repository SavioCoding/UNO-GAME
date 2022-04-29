const draw = (deck) => {
	// select a card
	selectedIndex = Math.floor(Math.random() * deck.length);
	selectedCard = deck[selectedIndex];

	//remove from deck
	deck.splice(selectedIndex, 1);

	return selectedCard;
};

const filterById = (cards, id) => {
	newCards = [];
	for (let i = 0; i < cards.length; i++) {
		if (cards[i]["id"] !== id) {
			newCards.push(cards[i]);
		}
	}
	return newCards;
};

const getCardById = (cards, id) => {
	for (let i = 0; i < cards.length; i++) {
		if (cards[i]["id"] === id) {
			return cards[i];
		}
	}
	return null;
};

const endGame = (result, io) => {
	// call this when game is ended
	// result = result: {tony:'win', may:'lose'}
	// gives this to client: {result: {tony:'win', may:'lose'}, players: [{gamertag, highscore}], stat:{tony: {"special card played": ...}}}
	const jsonData = fs.readFileSync("./data/users.json");
	const playersObj = JSON.parse(jsonData);
	let playersArr = [];
	for (player in playersObj) {
		let playerObj = {
			gamertag: playersObj[player].gamertag,
			highscore: playersObj[player].highscore,
		};
		playersArr.push(playerObj);
	}
	// sort playersArr by highscore descending
	playersArr.sort((a, b) => b.highscore - a.highscore);
	// get stat from global variable matchStat
	const returnObj = { result, players: playersArr, stat: matchStat };
	io.emit("gameover", JSON.stringify(returnObj));
	matchStat = {}; // reset matchStat object for next match
};

module.exports = {
	drawCard: draw,
	filterById: filterById,
	getCardById: getCardById,
	endGame,
};
