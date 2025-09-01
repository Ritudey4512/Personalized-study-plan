document.addEventListener('DOMContentLoaded', () => {
  const subjects = ['Probability', 'Automata', 'OS', 'Management'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const emojis = ['📚', '✏️', '🖊️', '📘', '📝', '📒', '📎'];
  const dailyStudyHours = 2;

  function generateSchedule() {
    const saved = localStorage.getItem('studySchedule');
    if (saved) return JSON.parse(saved);
    const defaultHours = dailyStudyHours / subjects.length;
    return Array.from({ length: 7 }, () => {
      const obj = {};
      subjects.forEach(s => obj[s] = defaultHours.toFixed(2));
      return obj;
    });
  }

  function renderCalendar(schedule) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const completion = JSON.parse(localStorage.getItem('taskCompletion') || '{}');

    days.forEach((day, i) => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';

      const h3 = document.createElement('h3');
      h3.textContent = day;
      dayDiv.appendChild(h3);

      const sticker = document.createElement('div');
      sticker.className = 'sticker';
      sticker.textContent = emojis[i % emojis.length];
      dayDiv.appendChild(sticker);

      const ul = document.createElement('ul');
      subjects.forEach(subj => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.textContent = subj + ': ';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = '0.1';
        input.value = schedule[i][subj];
        input.addEventListener('change', () => {
          schedule[i][subj] = parseFloat(input.value || 0).toFixed(2);
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const key = `${day}-${subj}`;
        checkbox.checked = completion[key] || false;
        checkbox.addEventListener('change', () => {
          completion[key] = checkbox.checked;
          localStorage.setItem('taskCompletion', JSON.stringify(completion));
          checkDayCompletion(day);
        });

        li.appendChild(label);
        li.appendChild(input);
        li.appendChild(checkbox);
        ul.appendChild(li);
      });

      const btn = document.createElement('button');
      btn.textContent = 'Save Day Hours';
      btn.className = 'save-hours-btn';
      btn.onclick = () => {
        localStorage.setItem('studySchedule', JSON.stringify(schedule));
        alert(`Saved schedule for ${day}`);
      };

      dayDiv.appendChild(ul);
      dayDiv.appendChild(btn);
      calendar.appendChild(dayDiv);

      checkDayCompletion(day);
    });
  }

  function checkDayCompletion(day) {
    const completion = JSON.parse(localStorage.getItem('taskCompletion') || '{}');
    const allDone = subjects.every(subj => completion[`${day}-${subj}`]);
    const msg = document.getElementById('reward-message');
    if (allDone) {
      msg.style.display = 'block';
      msg.textContent = `🎉 Congrats! You completed all tasks for ${day}! Here's a reward: 🎁 Keep up the great work!`;
      setTimeout(() => {
        msg.style.display = 'none';
      }, 4000);
    } else {
      msg.style.display = 'none';
    }
  }

  // Timer functions
  let timerInterval = null;
  let elapsedSeconds = 0;

  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer');
  const stopBtn = document.getElementById('stop-timer');
  const resetBtn = document.getElementById('reset-timer');

  function updateTimer() {
    elapsedSeconds++;
    const hrs = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }

  startBtn.onclick = () => {
    if (!timerInterval) {
      timerInterval = setInterval(updateTimer, 1000);
      startBtn.disabled = true;
      stopBtn.disabled = false;
      resetBtn.disabled = false;
    }
  };

  stopBtn.onclick = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  resetBtn.onclick = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedSeconds = 0;
    timerDisplay.textContent = '00:00:00';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
  };

  // Motivational quotes
  const quotes = [
    "The future belongs to those who prepare for it today. – Malcolm X",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "Success is the sum of small efforts repeated day in and day out. – Robert Collier",
    "Push yourself, because no one else is going to do it for you.",
    "The expert in anything was once a beginner."
  ];

  const quoteElem = document.getElementById('motivational-quote');
  const newQuoteBtn = document.getElementById('new-quote');

  function displayRandomQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    quoteElem.textContent = quotes[index];
  }

  newQuoteBtn.onclick = displayRandomQuote;

  // Initialize app
  const schedule = generateSchedule();
  renderCalendar(schedule);
  displayRandomQuote();
});