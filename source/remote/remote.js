let nameConfirmed = false;
let currentLetterIndex = 0;
let gameStarted = false;
let gameActive = false;
let playerName = "";
radio.setGroup(1);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WELCOME = "Welcome! Press A to start game.";
const NAME_PROMPT = "Name?";
const GAME_OVER = "Game Over!";

function resetGameState() {
  nameConfirmed = false;
  currentLetterIndex = 0;
  gameStarted = false;
  gameActive = false;
  playerName = "";
  basic.showString(WELCOME);
}

// Initialize the game state
resetGameState();

// Start game with Button A
input.onButtonPressed(Button.A, function () {
  if (!gameStarted) {
    gameStarted = true;
    basic.showString(NAME_PROMPT);
    showCurrentLetter();
  }
});

// Show the current letter
function showCurrentLetter() {
  basic.showString(alphabet.charAt(currentLetterIndex));
}

function endGame() {
  gameActive = false;
  basic.showString(GAME_OVER);
  basic.pause(2000);
  basic.clearScreen();
  resetGameState();
}

radio.onReceivedString(function (receivedString) {
  if (receivedString == "END") {
    endGame();
  }
});

// Confirm letter and complete name selection with Button A+B
input.onButtonPressed(Button.AB, function () {
  if (gameStarted && !gameActive && !nameConfirmed) {
    playerName += alphabet.charAt(currentLetterIndex);
    if (playerName.length >= 5) {
      //1 letter name, to change later to 5
      basic.showString(playerName);
      radio.sendString("START:" + playerName); // Send player name over to device
      nameConfirmed = true;
      basic.showString(" OK");
    }
  }
});

// Scroll through the alphabet with Button B, confirm with A+B
input.onButtonPressed(Button.B, function () {
  if (gameStarted && !nameConfirmed) {
    currentLetterIndex = (currentLetterIndex + 1) % alphabet.length;
    showCurrentLetter();
  }
});

basic.forever(function () {});
