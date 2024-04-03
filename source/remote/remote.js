let nameConfirmed = false;
let currentLetterIndex = 0;
let gameStarted = false;
let gameActive = false;
let playerName = "";
let lastGestureTime = 0;
let score = 0;
radio.setGroup(1);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WELCOME = "WLC! Press A";
const NAME_PROMPT = "Name?";
const GAME_START = "Go!";
const GAME_OVER = "Game Over!";
const GAME_END = "END";
const ACW = "ACW";
const CW = "CW";
const U = "U";
const D = "D";
const L = "L";
const R = "R";

function resetGameState() {
  nameConfirmed = false;
  currentLetterIndex = 0;
  gameStarted = false;
  gameActive = false;
  playerName = "";
  lastGestureTime = 0;
  basic.showString(WELCOME);
}

// Initialize the game state
resetGameState();

function startGame() {
  gameActive = true; // Enable gesture listening
  basic.showString(GAME_START);
  listenForGestures();

  control.inBackground(function () {
    while (gameActive) {
      updateScoreDisplay();
      basic.pause(500);
    }
  });
}

function countdown() {
  for (let i = 3; i > 0; i--) {
    basic.showNumber(i);
    basic.pause(1000);
  }
  basic.clearScreen();
  radio.sendString("START:" + playerName);
  startGame();
}

function updateScoreDisplay() {
  // Clear the LED display
  basic.clearScreen();

  // Calculate the number of LEDs to light up based on the score
  let ledsToLight = score % 25; // Modulo 25 to cycle through if score is above 24

  // Determine the row and column for each LED to light up
  for (let i = 0; i < ledsToLight; i++) {
    let row = Math.floor(i / 5);
    let col = i % 5;
    led.plot(col, row);
  }
}

// Start game with Button A
input.onButtonPressed(Button.A, function () {
  if (!gameStarted) {
    gameStarted = true;
    basic.showString(NAME_PROMPT);
    // Start name selection
    showCurrentLetter();
  }
});

// Show the current letter
function showCurrentLetter() {
  basic.showString(alphabet.charAt(currentLetterIndex));
}

radio.onReceivedString(function (receivedString) {
  if (receivedString == "END") {
    endGame();
  }
  if (receivedString.indexOf("S:") == 0) {
    score = parseInt(receivedString.split(":")[1]);
  }
});

function endGame() {
  gameActive = false;
  basic.showString(GAME_OVER);
  basic.pause(2000);
  basic.clearScreen();
  // resetGameState();
  crash();
}

function listenForGestures() {
  grove.onGesture(GroveGesture.Clockwise, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(CW);
    }
  });
  grove.onGesture(GroveGesture.Up, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(U);
    }
  });
  grove.onGesture(GroveGesture.Down, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(D);
    }
  });
  grove.onGesture(GroveGesture.Left, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(L);
    }
  });
  grove.onGesture(GroveGesture.Right, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(R);
    }
  });
  grove.onGesture(GroveGesture.Anticlockwise, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 1000) {
      lastGestureTime = input.runningTime();
      radio.sendString(ACW);
    }
  });
}

// Confirm letter and complete name selection with Button A+B
input.onButtonPressed(Button.AB, function () {
  if (gameStarted && !gameActive && !nameConfirmed) {
    playerName += alphabet.charAt(currentLetterIndex);
    // basic.showString(playerName);
    if (playerName.length >= 5) {
      //1 letter name, to change later to 5
      nameConfirmed = true;
      basic.showString(" OK");
      basic.pause(1000); // Pause to allow for garbage collection
      countdown();
    }
  }
});

// Function to force a 020 error (reset microbit)
function crash() {
  let largeArray = [];
  for (let i = 0; i < 10000; i++) {
    largeArray.push(i);
  }
}

// Scroll through the alphabet with Button B, confirm with A+B
input.onButtonPressed(Button.B, function () {
  if (gameStarted && !nameConfirmed) {
    currentLetterIndex = (currentLetterIndex + 1) % alphabet.length;
    showCurrentLetter();
  }
});
basic.forever(function () {});
