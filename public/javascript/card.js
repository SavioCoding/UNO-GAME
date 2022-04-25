class Card {
	static cardWidth = 32;
	static cardHeight = 48;
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

	draw(context) {
		let sheet = new Image();
		let sRow = this.color ? Card.row[this.color] : 4;
		let sCol = this.number ? this.number : Card.col[this.special];
		sheet.onload = function () {
			context.drawImage(
				sheet,
				sCol * Card.cardWidth,
				sRow * Card.cardHeight,
				Card.cardWidth,
				Card.cardHeight,
				50,
				50,
				96,
				144
			);
		};
		sheet.src = "./img/card-sprite.png";
	}
}
