function VI_Countdown(countdownElementId, countdownMessageElementId, getTargetDate) {
    const countdownElement = document.getElementById(countdownElementId);
    const countdownMessageElement = document.getElementById(countdownMessageElementId);

    const daysElement = document.querySelector(`#${countdownElementId} .days-var`);
    const hoursElement = document.querySelector(`#${countdownElementId} .hours-var`);
    const minutesElement = document.querySelector(`#${countdownElementId} .min-var`);
    const secondsElement = document.querySelector(`#${countdownElementId} .sec-var`);

    function updateCountdown() {
        const targetDate = getTargetDate();

        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;
        var interval = null;

        if (distance < 0) {
            countdownElement.style.display = 'none';
            countdownMessageElement.innerHTML = "Evenimentul a început deja!";

            if (interval) {
                clearInterval(interval);
            }

            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysElement.innerHTML = `${days}`;
        hoursElement.innerHTML = `${hours}`;
        minutesElement.innerHTML = `${minutes}`;
        secondsElement.innerHTML = `${seconds}`;
    }

    updateCountdown();
    
    interval = setInterval(updateCountdown, 1000);
}