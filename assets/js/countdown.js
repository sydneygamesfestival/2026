(function () {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const end = new Date(countdown.dataset.countdownEnd).getTime();
  const timer = countdown.querySelector('[role="timer"]');
  const message = countdown.querySelector('[data-countdown-message]');
  const fields = {
    days: countdown.querySelector('[data-countdown-days]'),
    hours: countdown.querySelector('[data-countdown-hours]'),
    minutes: countdown.querySelector('[data-countdown-minutes]'),
    seconds: countdown.querySelector('[data-countdown-seconds]'),
  };

  function render() {
    const now = Date.now();

    if (now >= target) {
      countdown.classList.add('is-complete');
      message.textContent = now < end
        ? 'Sydney Games Festival is underway'
        : 'Sydney Games Festival 2026 has wrapped';
      return;
    }

    const remainingSeconds = Math.floor((target - now) / 1000);
    const values = {
      days: Math.floor(remainingSeconds / 86400),
      hours: Math.floor((remainingSeconds % 86400) / 3600),
      minutes: Math.floor((remainingSeconds % 3600) / 60),
      seconds: remainingSeconds % 60,
    };

    Object.keys(values).forEach(function (key) {
      fields[key].textContent = String(values[key]).padStart(2, '0');
    });
    timer.setAttribute('aria-label',
      values.days + ' days, ' + values.hours + ' hours, ' +
      values.minutes + ' minutes until Sydney Games Festival begins');
  }

  render();
  window.setInterval(render, 1000);
})();
