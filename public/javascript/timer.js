const Timer = (function () {
	let timer = null;
	let timeRemaining = 20;
	let stop = false;
	let timeout = null;

	const getTime = function () {
		return timeRemaining;
	};

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
		timer = setInterval(() => {
			if (timeRemaining == 0) {
				clearInterval(timer);
				console.log("end");
			}
			GameScreen.updateTimer(timeRemaining);
			timeRemaining--;
		}, 1000);
	}

	return { countDown, startTimer, pauseTimer };
})();
