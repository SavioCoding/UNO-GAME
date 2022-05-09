const Timer = (function () {
	const START_TIME = 90;
	let timer = null;
	let timeRemaining = START_TIME;
	let interval = 1000;

	function getTimeUsed() {
		return START_TIME - timeRemaining;
	}

	function startTimer() {
		clearInterval(timer);
		timer = setInterval(() => {
			if (timeRemaining == 1) {
				clearInterval(timer);
				Socket.timesUp();
			}
			timeRemaining--;
			GameScreen.updateTimer(timeRemaining);
		}, interval);
	}

	function pauseTimer() {
		clearInterval(timer);
		timer = null;
	}

	function reduceInterval() {
		interval *= 0.5;
		// pause and restart the timer
		if (timer !== null) startTimer();
	}

	return { startTimer, pauseTimer, getTimeUsed, reduceInterval };
})();
