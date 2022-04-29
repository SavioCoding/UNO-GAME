const Timer = (function () {

    let timeRemaining = 180;
    let stop = false
    let timeout = null;

	function countDown() {
        if(stop==false){
            timeRemaining = timeRemaining - 1;
            $("#timer").text("Time left: "+timeRemaining+" seconds");
            console.log(timeRemaining)
            if (timeRemaining > 0)
                timeout = setTimeout(countDown, 1000);
            else{
                Socket.timesUp()
            }
        }
    }

    function stopTimer() {
        stop = true
        clearTimeout(timeout)
    }

    function startTimer() {
        stop = false
        timeout = setTimeout(countDown, 1000);
    }


	return { countDown, stopTimer, startTimer };
})();
