const logDiv = document.getElementById('log');
const intervalInput = document.getElementById('intervalInput');
const startPingButton = document.getElementById('startPingButton');
const stopPingButton = document.getElementById('stopPingButton');
const pingButton = document.getElementById('pingButton');
const clockDiv = document.getElementById('clock');
const pingCountSpan = document.getElementById('pingCount');
let intervalId;
let lastPingTime;
let totalPings = 0;

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  clockDiv.textContent = `Current Time: ${hours}:${minutes}:${seconds}`;
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function logMessage(message) {
  const now = new Date();
  logDiv.innerHTML += `<p>[${formatTime(now)}] ${message}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

function pingRenderApp() {
  lastPingTime = new Date();
  totalPings++;
  pingCountSpan.textContent = totalPings;

  fetch('/api/test', { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const timeElapsed = (new Date() - lastPingTime) / 1000;
      logMessage(`Ping successful: Status ${response.status} (Time taken: ${timeElapsed.toFixed(2)} seconds)`);
    })
    .catch(error => {
      const timeElapsed = (new Date() - lastPingTime) / 1000;
      logMessage(`Ping failed: ${error.message} (Time taken: ${timeElapsed.toFixed(2)} seconds)`);
    });
}

function startAutomaticPinging() {
  const intervalMinutes = parseInt(intervalInput.value);
  if (isNaN(intervalMinutes) || intervalMinutes < 1) {
    alert('Please enter a valid interval in minutes (minimum 1).');
    return;
  }
  const intervalMilliseconds = intervalMinutes * 60 * 1000;

  if (!intervalId) {
    intervalId = setInterval(pingRenderApp, intervalMilliseconds);
    startPingButton.disabled = true;
    stopPingButton.disabled = false;
    logMessage(`Automatic pinging started. Will occur every ${intervalMinutes} minutes.`);
  } else {
    logMessage("Automatic pinging is already running.");
  }
}

function stopAutomaticPinging() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startPingButton.disabled = false;
    stopPingButton.disabled = true;
    logMessage("Automatic pinging stopped.");
  } else {
    logMessage("Automatic pinging is not running.");
  }
}

// Event listeners
pingButton.addEventListener('click', pingRenderApp);
startPingButton.addEventListener('click', startAutomaticPinging);
stopPingButton.addEventListener('click', stopAutomaticPinging);

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial clock update

// Initial log message
logMessage("Page loaded. Enter ping interval and click 'Start Auto Ping' to begin.");