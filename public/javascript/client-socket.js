const Socket = (function () {
	let socket = null;
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
	};

	return { getSocket, connect, queue };
})();
