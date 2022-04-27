const Game = (function () {
	let context = null;
	let deck = null;

	// check if cards are initialized for first time
	let first = true

	// check if user can user the card
	let canUse = false;
	
	// js object (coordinates to id)
	let XYToid = {}

	// store card id if the card is valid and clicked once
	let checkedCard = null;

	// check if you are in current turn
	let yourTurn = false;

	const changeTurn = () => {
		yourTurn = !yourTurn;
	}

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

	// when you use a card and put it in the middle of the field
	const useCardAndPut = function (id, cards) {
		for (let i = 0; i < deck.length; ++i) {
			let x = i * Card.cardRenderWidth;
			let y = 400;
			let cardId = deck[i].id;
			if(cardId === id){
				context.clearRect(0, y, 1000, Card.cardRenderHeight);
				deck[i].draw(context, 400, 250);
				deck = parseCards(cards);
				renderSelfDeck(deck);
				break;
			}
		}
	}
	
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

	const filterById = (cards, id) => {
		newCards = []
		for (let i=0;i<cards.length;i++){
			if(cards[i]["id"] !== id){
				newCards.push(cards[i])
			}
		}
		return newCards
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
		if(first){
			function getCursorPosition(canvas, event) {
				const rect = canvas.getBoundingClientRect()
				const x = event.clientX - rect.left
				const y = event.clientY - rect.top
				let id = withinRect(x, y)
				if(yourTurn === true){
					if(id !== -1){
						// use already click the card once before
						if(checkedCard!==null){
							Socket.useCard(id)
							checkedCard = null
						}
						else{
							Socket.checkCard(id);
						}
					}else{
						checkCard = null;
						$("#validCard").hide()
						$("#selectCard").show()
					}
				}
			}

			const canvas = document.querySelector('canvas')
			canvas.addEventListener("click", function(e) {
				e.stopPropagation();
				e.preventDefault();
				getCursorPosition(canvas, e)
			})
			first = false
		}
	};

	return { initialize: initialize, renderOpponentCard: renderOpponentCard, changeTurn, changeCheckedCard, useCardAndPut };
})();
