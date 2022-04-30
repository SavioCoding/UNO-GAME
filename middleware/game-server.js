const fs = require("fs");

const jsonData = fs.readFileSync("./data/cards.json");
let allCards = JSON.parse(jsonData);

const randomCard = function () {
	return allCards[Math.floor(Math.random() * allCards.length)];
};

const startGame = function (gameState) {
	// randomly assigning 3 cards to each player
	for (const player of players) {
		for (let j = 0; j < 3; ++j) {
			gameState[player].push(randomCard());
		}
		matchStat[player] = {
			numSpecialCards: 0,
			numCheats: 0,
			time: 0,
			score: 0,
		};
	}
	// randomly assigning a person to start
	gameState["turn"] = players[Math.floor(Math.random() * players.length)];
	// randomly assigning a top card that is not special
	while (true) {
		let candidate = randomCard();
		if (candidate.special == null) {
			gameState.top = candidate;
			break;
		}
	}
};

const playCard = function (gameState, username, obj) {
	gameState[username].splice(obj.index, 1);
	gameState.top = obj.card;
	// Draw 4 or 2
	if (obj.card.special === "Add 4" || obj.card.special === "Add two") {
		matchStat[username].numSpecialCards += 1;
		const numAdd = obj.card.special === "Add 4" ? 4 : 2;
		for (const player of players) {
			if (player !== username) {
				for (let i = 0; i < numAdd; ++i) {
					drawCard(gameState, player);
				}
				return;
			}
		}
	}
	if (obj.card.special !== "Ban") {
		switchTurn(gameState);
	}
};

const drawCard = function (gameState, username) {
	gameState[username].push(randomCard());
};

const switchTurn = function (gameState) {
	let current = gameState["turn"];
	for (player of players) {
		if (player != current) {
			gameState["turn"] = player;
			break;
		}
	}
};

const isGameEnd = function (gameState) {
	for (const player of players) {
		if (gameState[player].length == 0) {
			return true;
		}
	}
	return false;
};

const endGame = (gameState, reason) => {
	// call this when game is ended
	// result = result: {tony:'win', may:'lose'}
	// gives this to client: {result: {tony:'win', may:'lose'}, players: [{gamertag, highscore}], stat:{tony: {"special card played": ...}}}

	// update high score
	const jsonData = fs.readFileSync("./data/users.json");
	const playersObj = JSON.parse(jsonData);
	const score1 = gameState[players[1]].length;
	const score2 = gameState[players[0]].length;
	playersObj[players[0]].highscore =
		score1 > playersObj[players[0]].highscore
			? score1
			: playersObj[players[0]].highscore;
	playersObj[players[1]].highscore =
		score1 > playersObj[players[1]].highscore
			? score2
			: playersObj[players[1]].highscore;

	// result
	const result = {};
	if (reason === "card") {
		// because one player played all cards
		for (const player of players) {
			if (gameState[player].length == 0) {
				result[player] = "win";
			} else {
				result[player] = "lose";
			}
		}
	}
	// time ended
	else {
		if (gameState[players[0]].length < gameState[players[1]].length) {
			result[players[0]] = "win";
			result[players[1]] = "lose";
		} else if (
			gameState[players[0]].length > gameState[players[1]].length
		) {
			result[players[1]] = "win";
			result[players[0]] = "lose";
		} else {
			result[players[1]] = "tie";
			result[players[0]] = "tie";
		}
	}

	// leaderboard
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
	console.log(returnObj);
	matchStat = {}; // reset matchStat object for next match
	//write back updated highscore
	fs.writeFileSync("data/users.json", JSON.stringify(playersObj, null, "  "));
	return returnObj;
};

module.exports = {
	startGame,
	drawCard,
	switchTurn,
	playCard,
	isGameEnd,
	endGame,
};
