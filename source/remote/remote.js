let nameConfirmed = false;
let currentLetterIndex = 0;
let gameStarted = false;
let gameActive = false;
let playerName = "";
let alphabet = "";
let lastGestureTime = 0;
radio.setGroup(1);
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
basic.showString("Welcome! Press A to start");

function startGame() {
  gameActive = true; // Enable gesture listening
  basic.showString("Go!");
  listenForGestures();
}
function countdown() {
  for (let i = 3; i > 0; i--) {
    basic.showNumber(i);
    basic.pause(1000);
  }
  basic.clearScreen();
  // Signal the game start with the player's name after countdown
  radio.sendString("START,Name:" + playerName);
  startGame();
}
// Start game with Button A
input.onButtonPressed(Button.A, function () {
  if (!gameStarted) {
    gameStarted = true;
    basic.showString("Name:");
    // Start name selection
    showCurrentLetter();
  }
});
// Show the current letter
function showCurrentLetter() {
  basic.showString(alphabet.charAt(currentLetterIndex));
}

// Listen for game end signal
radio.onReceivedString(function (receivedString) {
  if (receivedString == "GAME END") {
    gameActive = false; // Stop listening for gestures
    basic.showString("Game Over");
    basic.pause(2000);
    basic.clearScreen();

    // Reset game state
    gameStarted = false;
    gameActive = false;
    playerName = "";
    nameConfirmed = false;
    currentLetterIndex = 0;
    basic.showString("Welcome! Press A to start");
  }
});

function listenForGestures() {
  grove.onGesture(GroveGesture.Clockwise, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("CW");
      basic.showIcon(IconNames.Happy);
    }
  });
  grove.onGesture(GroveGesture.Up, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("U");
      basic.showArrow(ArrowNames.North);
    }
  });
  grove.onGesture(GroveGesture.Down, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("D");
      basic.showArrow(ArrowNames.South);
    }
  });
  grove.onGesture(GroveGesture.Left, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("L");
      basic.showArrow(ArrowNames.West);
    }
  });
  grove.onGesture(GroveGesture.Right, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("R");
      basic.showArrow(ArrowNames.East);
    }
  });
  grove.onGesture(GroveGesture.Anticlockwise, function () {
    if (gameActive && input.runningTime() - lastGestureTime >= 500) {
      lastGestureTime = input.runningTime();
      radio.sendString("ACW");
      basic.showIcon(IconNames.Sad);
    }
  });
}

// Confirm letter and complete name selection with Button A+B
input.onButtonPressed(Button.AB, function () {
  // This condition prevents name confirmation during active gameplay
  if (gameStarted && !gameActive && !nameConfirmed) {
    playerName += alphabet.charAt(currentLetterIndex);
    basic.showString(playerName);
    if (playerName.length >= 1) {
      // 1 letter name
      nameConfirmed = true;
      basic.showString("OK");
      countdown();
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
