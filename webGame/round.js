/* IMPORTS */
let players = JSON.parse(localStorage.getItem("players")) || [];
let puzzles = JSON.parse(localStorage.getItem("puzzles")) || [];

/* GLOBAL VARS */
let puzzle = "";
let puzzleArray = [];
let puzzleHatch = [];
let guessedLetters = [];
let currentPlayer = 0;
let spinTracker = 0;
let isNextRound = false;

/* ELEMENTS */
const spinButton = document.getElementById("spinButton");
const spinPoints = document.getElementById("spinPoints");
const guessControls = document.getElementById("guessControls");
const solveControls = document.getElementById("solveControls");
const nextRoundButton = document.getElementById("nextRoundButton");

/* PLAYING GAME */

/* FUNCTIONS */
function calculatePoints() {
  const wheel = [
    0, 650, 900, 700, 500, 800, 500, 650, 500, 900, 0, 1000, 500, 900, 700, 600,
    8000, 500, 700, 600, 550, 500, 900,
  ];

  let spin = wheel[Math.floor(Math.random() * wheel.length)];

  return spin;
}

function generatePuzzle() {
  let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  return puzzle;
}

function checkWord(playerNum, puzzle, spin) {
  let word = document.getElementById("wordInput").value.trim();
  document.getElementById("wordInput").value = "";
  let guessCorrect = false;

  if (word && (word == puzzle || word == puzzle.toLowerCase())) {
    players[playerNum].roundScore += spin;
    guessCorrect = true;
  } else {
    players[playerNum].roundScore = 0;
  }
  return guessCorrect;
}

function checkLetter(playerNum, spin, guess, puzzleArray, puzzleHatch) {
  let guessCorrect = false;
  for (let i = 0; i < puzzleArray.length; i++) {
    if (guess == puzzleArray[i].toLowerCase()) {
      puzzleHatch[i] = puzzleArray[i].toUpperCase();
      players[playerNum].roundScore += spin;
      guessCorrect = true;
    }
  }
  if (guessCorrect) {
    show("guessResult", "Correct Letter!");
  } else {
    players[playerNum].roundScore -= spin / 2;
    if (players[playerNum].roundScore < 0) players[playerNum].roundScore = 0;
  }
  updatePuzzleDisplay();
  updateScores();
  return guessCorrect;
}

function playerTurn() {
  spinTracker = 0;
  clear("guessResult");
  clear("output");

  updatePlayer();
  updatePuzzleDisplay();
  updateScores();
  updateSpinDisplay();

  spinPoints.style.display = "none";
  spinButton.style.display = "inline";
  guessControls.style.display = "none";
  solveControls.style.display = "none";
}

function gameRound() {
  puzzle = generatePuzzle();
  puzzleArray = [];
  puzzleHatch = [];

  for (let i = 0; i < puzzle.length; i++) {
    puzzleArray[i] = puzzle.charAt(i);
    puzzleHatch[i] = puzzleArray[i] === " " ? " " : "-";
  }
  guessedLetters = [];
  players.forEach((p) => (p.roundScore = 0));

  isNextRound = false;
  playerTurn(currentPlayer, puzzle, puzzleArray, puzzleHatch);
}

function SpinTheWheel() {
  if (isNextRound) return;

  spinTracker = calculatePoints();
  updateSpinDisplay();

  clear("guessResult");
  clear("output");

  spinButton.style.display = "none";
  spinPoints.style.display = "block";

  if (spinTracker === 0) {
    showPopUp("Oh no! You spun 0!");
  } else {
    guessControls.style.display = "inline";
    solveControls.style.display = "inline";
  }
}

function doGuess() {
  if (isNextRound || spinTracker === 0) return;
  let guess = document.getElementById("guessInput").value.trim().toLowerCase();
  document.getElementById("guessInput").value = "";
  if (!/^[a-z]$/.test(guess)) {
    show("output", "Please Enter One Letter");
    return;
  }
  if (guessedLetters.includes(guess)) {
    show("output", "Letter " + guess.toUpperCase() + " Already Guessed");
    return;
  }
  guessedLetters.push(guess);
  let correct = checkLetter(
    currentPlayer,
    spinTracker,
    guess,
    puzzleArray,
    puzzleHatch
  );

  if (
    puzzleArray.join("").toLowerCase() === puzzleHatch.join("").toLowerCase()
  ) {
    endRound(players[currentPlayer].name + " solved the puzzle!");
  } else if (!correct) {
    showPopUp("Wrong Letter!");
  } else {
    spinButton.style.display = "inline";
    guessControls.style.display = "none";
    solveControls.style.display = "none";
  }
}

function doSolve() {
  if (isNextRound || spinTracker === 0) return;
  if (checkWord(currentPlayer, puzzle, spinTracker)) {
    puzzleHatch = puzzleArray;
    endRound("The word is solved!");
  } else {
    showPopUp("You guessed wrong!");
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % players.length;

  if (!isNextRound) {
    showNextTurn(players[currentPlayer].name + "'s Turn!");
    playerTurn(currentPlayer, puzzle, puzzleArray, puzzleHatch);
  }
}

function nextRound() {
  if (isNextRound) {
    nextRoundButton.style.display = "none";
    gameRound();
  }
}

function endRound(message) {
  players[currentPlayer].totalScore += players[currentPlayer].roundScore;
  updateScores();
  localStorage.setItem("players", JSON.stringify(players));

  isNextRound = true;
  show("output", message);

  guessControls.style.display = "none";
  solveControls.style.display = "none";
  spinButton.style.display = "none";
  nextRoundButton.style.display = "inline";
}

function goHome() {
  window.location.href = "home.html";
}

/* UPDATES */

function updatePlayer() {
  document.getElementById("playerName").innerText = players[currentPlayer].name;
}

function updateScores() {
  document.getElementById("roundScore").innerText =
    players[currentPlayer].roundScore;
  document.getElementById("totalScore").innerText =
    players[currentPlayer].totalScore;
}

function updatePuzzleDisplay() {
  document.getElementById("puzzleDisplay").innerText = puzzleHatch.join(" ");
}

function updateSpinDisplay() {
  document.getElementById("spinPoints").innerText = spinTracker;
}

function show(elementID, message) {
  document.getElementById(elementID).innerText = message;
}

function clear(elementID) {
  document.getElementById(elementID).innerText = "";
}

function showPopUp(message) {
  const popup = document.getElementById("turnPopup");
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(() => {
    nextPlayer();
  }, 2000);
}

function showNextTurn(message) {
  const popup = document.getElementById("turnPopup");
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
    gameInfo.style.display = "block";
  }, 2000);
}

/* START GAME */
gameRound();
