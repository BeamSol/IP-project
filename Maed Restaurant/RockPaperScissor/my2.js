let difficulty = 'normal';
let theme = 'default';
let timer;
let timeLeft = 10;
let gameStarted = false; 
let timerPaused = false; 
let gameRestarted = false; 
let timerRunning = false; 
let consecutiveWins = 0;
let consecutiveTies = 0;
let consecutiveLosses = 0;

function userChoice(choice) {
  if (!gameStarted && !gameRestarted) {
    alert("Please start the game first!");
    return;
  }

  if (timerPaused && !gameRestarted) {
    alert("The game is currently paused. Resume the game to make a move.");
    return;
  }
  
  if (choice === '') {
    
    document.getElementById('loss-message').classList.remove('hidden');
    return;
  }

  resetTimer();

  const computerChoice = determineComputerChoice(choice);
  const result = determineResult(choice, computerChoice);

  updateScore(result);
  displayResult(choice, computerChoice, result);

  gameRestarted = false;
}





function startGame() {
  if (!gameStarted || gameRestarted) {
    initializeGame();
    updateGameMessage("Game started! Make your move.");
  } else {
    updateGameMessage("Game already in progress. Make your move.");
  }
}

function initializeGame() {
  resetGame();
  resetTimer();
  gameStarted = true;
  gameRestarted = false;
  timerRunning = false;
  updateGameMessage("Game initialized!");
}

window.onload = function () {
  addThemes();  
  
  const storedScore = localStorage.getItem('rpsScore');
  if (storedScore) {
    const { wins: storedWins, losses: storedLosses, ties: storedTies } = JSON.parse(storedScore);
    wins = storedWins;
    losses = storedLosses;
    ties = storedTies;
    updateScoreDisplay();
  }
};

function changeTheme() {
  theme = document.getElementById('themeSelect').value;
  applyTheme();
}
function applyTheme() {
  document.body.className = theme;

  const userImageElement = document.getElementById('userImage');
  const computerImageElement = document.getElementById('computerImage');

  userImageElement.className = theme;
  computerImageElement.className = theme;
}

function addThemes() {
  const themeSelect = document.getElementById('themeSelect');

  const additionalThemes = ['dark', 'light', 'ocean'];

  additionalThemes.forEach(newTheme => {
    const option = document.createElement('option');
    option.value = newTheme;
    option.text = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
    themeSelect.add(option);
  });

  applyTheme();
}


function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  updateTimer();

  if (timerRunning && gameStarted) {
    startTimer(); 
  }
}


function startTimer() {
  timer = setInterval(function () {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      handleTimerEnd();
      resetTimer();
    }
  }, 1000);

  timerRunning = true; 
}
function pauseResumeTimer() {
  if (timerPaused) {
    startTimer(); 
    timerPaused = false;
    alert("Game resumed!");
  } else {
    clearInterval(timer); 
    timerPaused = true;
    alert("Game paused.");
  }
}

function updateTimer() {
  document.getElementById('time').textContent = timeLeft;
}

function handleTimerEnd() {

  const userChoice = 'timeout';
  const computerChoice = getRandomMove();
  const result = determineResult(userChoice, computerChoice);

  updateScore(result);
  displayResult(userChoice, computerChoice, result);
}
function updateConsecutiveAchievements(result) {
  if (result === 'You win!') {
    consecutiveWins++;
    consecutiveTies = 0; 
    consecutiveLosses = 0;
  } else if (result === 'It\'s a tie!') {
    consecutiveTies++;
    consecutiveWins = 0; 
    consecutiveLosses = 0;
  } else if (result === 'You lose!') {
    consecutiveLosses++;
    consecutiveWins = 0; 
    consecutiveTies = 0;
  }

  checkConsecutiveAchievements();
}

function checkConsecutiveAchievements() {
  const badgesElement = document.getElementById('badges');

  if (consecutiveWins === 3) {
    badgesElement.textContent = "Congratulations! You achieved 3 consecutive wins!";
    consecutiveWins = 0; 
  }

  if (consecutiveTies === 3) {
    badgesElement.textContent = "Wow! 3 consecutive ties. Keep it up!";
    consecutiveTies = 0; 
  }

  if (consecutiveLosses === 3) {
    badgesElement.textContent = "Oops! 3 consecutive losses. You can do better!";
    consecutiveLosses = 0; 
  }
}

function startGame() {
  if (!gameStarted || gameRestarted) {
    initializeGame();
    alert("Game started! Make your move.");
  }
}
function updateGameMessage(message) {
  const gameResultElement = document.getElementById('game-result');
  gameResultElement.innerHTML = message;
}
function updateScoreDisplay() {
  const winsElement = document.getElementById('wins');
  const lossesElement = document.getElementById('losses');
  const tiesElement = document.getElementById('ties');

  winsElement.textContent = wins;
  lossesElement.textContent = losses;
  tiesElement.textContent = ties;
}

function determineComputerChoice(userChoice) {
  if (difficulty === 'easy') {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
  } else if (difficulty === 'normal') {
    const shouldCounter = Math.random() < 0.3;
    if (shouldCounter && userChoice !== '') {
      return counterMove(userChoice);
    } else {
      return getRandomMove();
    }
  } else if (difficulty === 'hard') {
    return getRandomMove();
  }
}

function getRandomMove() {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * 3)];
}

function counterMove(move) {
  const counterMoves = {
    'rock': 'paper',
    'paper': 'scissors',
    'scissors': 'rock'
  };
  return counterMoves[move];
}

function determineResult(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'It\'s a tie!';
  } else if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'You win!';
  } else {
    return 'You lose!';
  }
}

function updateScore(result) {
  const winsElement = document.getElementById('wins');
  const lossesElement = document.getElementById('losses');
  const tiesElement = document.getElementById('ties');

  if (result === 'You win!') {
    wins++;
  } else if (result === 'You lose!') {
    losses++;
  } else {
    ties++;
  }

  winsElement.textContent = wins;
  lossesElement.textContent = losses;
  tiesElement.textContent = ties;
}

function displayResult(userChoice, computerChoice, result) {
  const userImageElement = document.getElementById('userImage');
  const computerImageElement = document.getElementById('computerImage');
  const noChoiceTextElement = document.getElementById('noChoiceText');
  const gameResultElement = document.getElementById('game-result');


  userImageElement.src = `images/${userChoice}-emoji.png`;
  computerImageElement.src = `images/${computerChoice}-emoji.png`;


  userImageElement.onerror = function() {

    userImageElement.style.display = 'none';

    noChoiceTextElement.style.display = 'block';
  };

  computerImageElement.onerror = function() {

    computerImageElement.style.display = 'none';

    noChoiceTextElement.style.display = 'block';
  };

  userImageElement.classList.remove('hidden');
  computerImageElement.classList.remove('hidden');

  noChoiceTextElement.style.display = 'none';

  if (userChoice !== 'timeout') {
    gameResultElement.innerHTML = `<p><strong>${result}</strong></p>
                                   <p>Game started! Make your move.</p>`;
  } else {
    gameResultElement.innerHTML = `<p>${result}</p>`;
  }

  resetTimer();
}

function showRules() {
  const modal = document.getElementById('rules-modal');
  modal.style.display = 'block';
}


function closeRulesModal() {
  const modal = document.getElementById('rules-modal');
  modal.style.display = 'none';
}


window.onclick = function (event) {
  const modal = document.getElementById('rules-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};


window.onload = function () {
  showRules();
};


function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  updateTimer();
  startTimer();
}

function startTimer() {
  timer = setInterval(function () {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      handleTimerEnd();
      resetTimer();
    }
  }, 1000);
}

function updateTimer() {
  document.getElementById('time').textContent = timeLeft;
}

function resetGame() {
  wins = 0;
  losses = 0;
  ties = 0;

  const winsElement = document.getElementById('wins');
  const lossesElement = document.getElementById('losses');
  const tiesElement = document.getElementById('ties');

  winsElement.textContent = wins;
  lossesElement.textContent = losses;
  tiesElement.textContent = ties;

  const gameResultElement = document.getElementById('game-result');
  gameResultElement.innerHTML = `<p><Strong>Game restarted.</br> Let\'s play again!</p>`;
  
}

let wins = 0;
let losses = 0;
let ties = 0;