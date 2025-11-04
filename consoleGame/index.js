/*
Author: Miriam Khan
Date: 9/16/25
Description: A Console-Based Wheel of Fortune Game written in JavaScript
*/

/* GLOBAL VARS */

var print = console.log;
const prompt = require("prompt-sync")();
var players = [];
var puzzles = [];
var guessedLetters = [];

/* PLAYING GAME */

//chooses a random number from the wheel array
function SpinTheWheel() {
  const wheel = [
    0, 650, 900, 700, 500, 800, 500, 650, 500, 900, 0, 1000, 500, 900, 700, 600,
    8000, 500, 700, 600, 550, 500, 900,
  ];

  let spin = wheel[Math.floor(Math.random() * wheel.length)];

  return spin;
}

//generates puzzle from puzzle bank
function generatePuzzle() {
  let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  return puzzle;
}

//display's hatch - its own function bc printed multiple times
function displayPuzzleHatch(puzzleHatch) {
  print("Puzzle: ", puzzleHatch.join(" "));
}

//checks if player's word matches the puzzle
function checkWord(playerNum, puzzle) {
  let word = prompt("What word would you like to guess? ");
  let guessCorrect = false;

  if (word == puzzle || word == puzzle.toLowerCase()) {
    print("You guessed it!");
    guessCorrect = true;
  } else {
    print("You guessed wrong!");
    guessCorrect = false;
    players[playerNum].roundScore = 0;
  }
  print();

  return guessCorrect;
}

//checks if player's letter matches a letter in the puzzle
function checkLetter(playerNum, spin, guess, puzzleArray, puzzleHatch) {
  let guessCorrect = false;

  //loops through puzzle to match for letter
  for (let i = 0; i < puzzleArray.length; i++) {
    if (guess == puzzleArray[i] || guess == puzzleArray[i].toLowerCase()) {
      puzzleHatch[i] = guess.toUpperCase();
      players[playerNum].roundScore += spin;
      guessCorrect = true;
    }
  }

  //updates score based on guess
  if (guessCorrect) {
    print("Correct Letter!");
  } else {
    players[playerNum].roundScore -= spin / 2;
    if (players[playerNum].roundScore < 0) {
      players[playerNum].roundScore = 0;
    }
    print("Wrong Letter!");
  }

  displayPuzzleHatch(puzzleHatch);
  print("Your Round Score: ", players[playerNum].roundScore, "\n");
  return guessCorrect;
}

//contains all the logic for a single round for a single player
function playerTurn(playerNum, puzzle, puzzleArray, puzzleHatch) {
  let guessLetterCorrect = true;
  let IsPuzzleComplete = false;
  let keepPlaying = 1;

  // print("Answer: ", puzzleArray.join("")); //FOR TESTING PURPOSES
  print("Player ", playerNum + 1, " - ", players[playerNum].name);
  print("It's your turn!");
  print();

  displayPuzzleHatch(puzzleHatch);

  /*allows the player to continue guessing until
  - player chooses to end game
  - word is guessed incorrectly
  */
  while (keepPlaying !== 2 && guessLetterCorrect && !IsPuzzleComplete) {
    //prints round score
    print("Your Round Score: ", players[playerNum].roundScore);
    let input = prompt("Press ENTER to spin the Wheel!");
    while (input !== "") {
      print(" Please Press Enter");
      input = prompt("Press ENTER to spin the Wheel!");
    }
    print();

    //prints spin results
    let spin = SpinTheWheel();
    print("Your Spin: ", spin);

    //checks if spin is 0 or letter is correct
    if (spin !== 0) {
      //prompting for letter
      let guess;
      do {
        guess = prompt("What letter would you like to guess? ");
        if (!/^[a-zA-Z]$/.test(guess)) {
          print(" Please Enter One Letter");
        } else if (guessedLetters.includes(guess)) {
          print("Letter ", guess.toUpperCase(), " Already Guesssed");
        }
      } while (!/^[a-zA-Z]$/.test(guess) || guessedLetters.includes(guess));
      print();

      guessedLetters.push(guess);
      //checking letter with puzzle
      guessLetterCorrect = checkLetter(
        playerNum,
        spin,
        guess,
        puzzleArray,
        puzzleHatch
      );
    } else {
      print("You Spun 0 :(");
      guessLetterCorrect = false;
    }

    //checks if puzzle is complete
    if (puzzleArray.join("") == puzzleHatch.join("")) IsPuzzleComplete = true;

    if (!IsPuzzleComplete) {
      if (guessLetterCorrect) {
        //prompts user to guess letter again or solve
        keepPlaying = Number(
          prompt("Enter 1 to Spin & Guess again, or 2 to solve: ")
        );
        while (!/^[12]$/.test(keepPlaying)) {
          print(" Please Enter 1 Or 2");
          keepPlaying = Number(
            prompt("Enter 1 to Spin & Guess again, or 2 to solve: ")
          );
        }
        print();
      }
    }
  }

  //determines if word is guessed correctly
  if (keepPlaying == 2) {
    const correctWord = checkWord(playerNum, puzzle, puzzleHatch);
    //checks if puzzle is complete
    if (correctWord) {
      print(puzzle);
      IsPuzzleComplete = true;
    } else {
      displayPuzzleHatch(puzzleHatch);
    }
  }

  //prints final turn scores
  print("Turn Over");
  print("Round Score: ", players[playerNum].roundScore);
  players[playerNum].totalScore += players[playerNum].roundScore;
  print("Total Score: ", players[playerNum].totalScore, "\n");

  return IsPuzzleComplete;
}

//switches turns between players until round is complete
function gameRound(puzzle, puzzleArray, puzzleHatch) {
  let IsPuzzleComplete = false;

  while (!IsPuzzleComplete) {
    //loops through players turns
    for (let playerNum = 0; playerNum < players.length; playerNum++) {
      if (!IsPuzzleComplete) {
        IsPuzzleComplete = playerTurn(
          playerNum,
          puzzle,
          puzzleArray,
          puzzleHatch
        );
      }
    }
  }
}

//allows players to play more than one games, displays final game scores
function playGame() {
  do {
    //turns puzzle into array and hatch array for guessing purposes
    let puzzle = generatePuzzle();
    let puzzleHatch = [];
    let puzzleArray = [];

    for (let i = 0; i < puzzle.length; i++) {
      puzzleArray[i] = puzzle.charAt(i);
      puzzleHatch[i] = "-";
    }
    gameRound(puzzle, puzzleArray, puzzleHatch);

    print("FINAL ROUND SCORES");
    print("------------------");
    for (player of players) {
      print("player ", player.name, " - ", player.roundScore);
      player.roundScore = 0;
    }
    guessedLetters = [];
    print();

    //prompts to play another round
    playAgain = Number(prompt("Press 1 to play another round, 2 to end: "));
    while (!/^[12]$/.test(playAgain)) {
      print(" Please Enter 1 Or 2");
      playAgain = Number(prompt("Press 1 to play another round, 2 to end: "));
    }
    print();
  } while (playAgain !== 2);

  print("FINAL GAME SCORES");
  print("------------------");
  for (player of players) {
    print("player ", player.name, " - ", player.totalScore);
  }
  print();
}

/* INITIALIZING GAME */

//initializes a single player in the array
function initializePlayer(i) {
  print("Welcome Player ", i);
  let playerName = prompt("What is your name? ");
  while (!/^[a-zA-Z]+$/.test(playerName)) {
    print(" Please Enter Letters");
    playerName = prompt("What is your name? ");
  }
  players.push({ name: playerName, roundScore: 0, totalScore: 0 });
}

//assigns dictionary text to an array full of words from text
function initalizeDict() {
  let fs = require("fs");

  const readFileLines = (filename) =>
    fs.readFileSync(filename).toString("utf8").split("\n");

  let arr = readFileLines("dictionary.txt");
  puzzles = arr;
}

//asks for amount of players, initaizlies players, and intializes dictionary
function initalizeGame() {
  print("Welcome to Fortune Wheel!");
  let numOfPlayers = prompt("How many players?(1-3) ");
  while (!/^[123]$/.test(numOfPlayers)) {
    print("Please Enter 1, 2, Or 3");
    numOfPlayers = prompt("How many players?(1-3) ");
  }
  print();

  for (let i = 1; i <= numOfPlayers; i++) {
    initializePlayer(i);
  }
  print();

  initalizeDict();
}

/* MAIN */

function main() {
  initalizeGame();
  playGame();
}

main();
