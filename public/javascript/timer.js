const Timer = (function () {
	const START_TIME = 90;
	let timer = null;
	let timeRemaining = START_TIME;
	let interval = 1000;

	function getTimeUsed() {
		return START_TIME - timeRemaining;
	}

	// if the timer is paused, this function will start the timer
	// if the timer has started, this function will pause the timer
	function startPauseTimer() {
		if (timer === null) {
			// if paused, then start
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
		// if paused
		else {
			clearInterval(timer);
			timer = null;
		}
	}

	function reduceInterval() {
		interval *= 0.5;
		console.log(interval);
	}

	return { startPauseTimer, getTimeUsed, reduceInterval };
})();
