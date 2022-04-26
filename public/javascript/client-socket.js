const Socket = (function () {
	let socket = null;
	let firstDraw = true;
	const getSocket = function () {
		return socket;
	};

	const connect = function () {
		socket = io();

		socket.on("connect", () => {
			console.log("Connected");
		});
	};

	const queue = function () {
		socket.emit("queue");

		socket.on("start game", () => {
			// TODO: client-side start game things
			WaitingScreen.hide();
			console.log("game started");
		});
	};
	
	const draw_card = function () {
		if(firstDraw == true){
			socket.emit("firstDraw")
			firstDraw = false
		}
		else{
			socket.emit("draw")
		}
		socket.on("card drawn", (cards) => {
			Game.initialize(cards);
			Game.renderOpponentCard(cards.length);
		})
	}

	return { getSocket, connect, queue, draw_card };
})();
