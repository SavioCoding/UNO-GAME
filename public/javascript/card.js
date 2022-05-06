class Card {
	static cardWidth = 32;
	static cardHeight = 48;
	static cardRenderWidth = Card.cardWidth * 3;
	static cardRenderHeight = Card.cardHeight * 3;
	static row = {
		red: 0,
		blue: 1,
		yellow: 2,
		green: 3,
	};

	static col = {
		Ban: 10,
		Swap: 11,
		"Add two": 12,
		"Change color": 0,
		"Add 4": 5,
	};

	constructor(number, color, special) {
		this.number = number;
		this.color = color;
		this.special = special;
	}

	draw(context, x, y) {
		let sheet = new Image();
		let sRow;
		let sCol;
		if (!this.number && !this.color && !this.special) {
			// backside of the card
			sRow = 4;
			sCol = 10;
		}
		// for changed color
		else if (this.special === "Change color" && this.color !== null) {
			sRow = 4;
			if (this.color === "red") sCol = 1;
			else if (this.color === "blue") sCol = 2;
			else if (this.color === "yellow") sCol = 3;
			else sCol = 4;
		}
		// for draw 4
		else if (this.special === "Add 4" && this.color !== null) {
			sRow = 4;
			if (this.color === "red") sCol = 6;
			else if (this.color === "blue") sCol = 7;
			else if (this.color === "yellow") sCol = 8;
			else sCol = 9;
		}
		// other cards
		else {
			sRow = this.color ? Card.row[this.color] : 4;
			sCol = this.special ? Card.col[this.special] : this.number;
		}
		sheet.onload = function () {
			context.drawImage(
				sheet,
				sCol * Card.cardWidth,
				sRow * Card.cardHeight,
				Card.cardWidth,
				Card.cardHeight,
				x,
				y,
				Card.cardRenderWidth,
				Card.cardRenderHeight
			);
		};
		sheet.src = "./img/card-sprite.png";
	}
}
