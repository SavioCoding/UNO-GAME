const Timer = (function () {
	const START_TIME = 90;
	let timer = null;
	let timeRemaining = START_TIME;
	let interval = 1000;

	function getTimeUsed() {
		return START_TIME - timeRemaining;
	}

	function countDown() {
		if (stop == false) {
			timeRemaining = timeRemaining - 1;
			$("#timer").text("Time left: " + timeRemaining + " seconds");
			if (timeRemaining > 0) timeout = setTimeout(countDown, 1000);
			else {
				Socket.timesUp();
			}
		}
	}

	const pauseTimer = function () {
		console.log("Paused: " + timeRemaining + " remaining");
		clearInterval(timer);
	};

	function startTimer() {
		let stop = false;
		timer = setInterval(() => {
			if (timeRemaining == 0) {
				stop = true;
				Socket.timesUp();
			}
			GameScreen.updateTimer(timeRemaining);
			timeRemaining--;
		}, interval);
		if (stop) clearInterval(timer);
	}

	return { countDown, startTimer, pauseTimer, getTimeUsed };
})();
