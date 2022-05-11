const Timer = (function () {
	const START_TIME = 90;
	const NORMAL_INTERVAL = 1000;
	let timer = null;
	let timeRemaining = START_TIME;
	let interval = NORMAL_INTERVAL;

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

	function reset() {
		timeRemaining = START_TIME;
		interval = NORMAL_INTERVAL;
		$("#timer").text("01:30");
	}

	return { startTimer, pauseTimer, getTimeUsed, reduceInterval, reset };
})();
