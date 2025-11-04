const startButton = document.getElementById("startButton");
const numPlayersDiv = document.getElementById("numPlayersDiv");
const numInput = document.getElementById("numOfPlayers");
const numError = document.getElementById("numError");
const submitButton = document.getElementById("submitButton");

const playerDiv = document.getElementById("playerDiv");
const playerText = document.getElementById("playerText");
const playerInput = document.getElementById("playerName");
const nameError = document.getElementById("nameError");
const submitButtonTwo = document.getElementById("submitButtonTwo");

const beginButton = document.getElementById("beginButton");

var players = [];
var puzzles = [];
let numOfPlayers = 0;
let currentPlayer = 1;

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  numPlayersDiv.style.display = "block";
  numInput.focus();
});

submitButton.addEventListener("click", initializeGame);
submitButtonTwo.addEventListener("click", initializePlayers);
beginButton.addEventListener("click", startRound);

function initializeGame() {
  const num = numInput.value.trim();
  if (!/^[123]$/.test(num)) {
    numError.textContent = "Please enter 1, 2, or 3";
    numInput.focus();
    return;
  }
  numError.textContent = "";
  numOfPlayers = parseInt(num);
  numPlayersDiv.style.display = "none";
  showPlayerText(currentPlayer);
}

function initializePlayers() {
  const name = playerInput.value.trim();
  if (!/^[a-zA-Z]+$/.test(name)) {
    nameError.textContent = "Please enter letters only";
    playerInput.focus();
    return;
  }
  nameError.textContent = "";
  players.push({ name: name, roundScore: 0, totalScore: 0 });
  currentPlayer++;
  if (currentPlayer <= numOfPlayers) {
    showPlayerText(currentPlayer);
  } else {
    playerDiv.style.display = "none";
    beginButton.style.display = "block";
  }
}

function showPlayerText(playerNum) {
  playerText.innerText = `Player ${playerNum}, enter your name:`;
  playerInput.value = "";
  nameError.textContent = "";
  playerDiv.style.display = "block";
  playerInput.focus();
}

async function startRound() {
  await initializeDict();

  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("puzzles", JSON.stringify(puzzles));

  window.location.href = "round.html";
}

async function initializeDict() {
  try {
    const response = await fetch("dictionary.txt");
    if (!response.ok) throw new Error("failed to load dictionary!");

    const text = await response.text();
    puzzles = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
  } catch (err) {
    console.error("error loading dictionary!", err);
  }
}
