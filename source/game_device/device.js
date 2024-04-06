radio.setGroup(1);
let score = 0;
let gameActive = false;
let playerName = "";
let currentGesture = ""; // Variable to store the currently expected gesture
let gestureScored = false; // Track if a point has been scored for the current gesture
let lastGestureTime = 0;

// Gesture constants
const U = "U";
const D = "D";
const L = "L";
const R = "R";
const CW = "CW";
const ACW = "ACW";

// init display
let display = grove.createDisplay(DigitalPin.P1, DigitalPin.P15);

function displayGesture() {
  gestureScored = false; // Reset for the new gesture
  let gestures = ["U", "D", "L", "R", "CW", "ACW"];
  currentGesture = gestures[Math.floor(Math.random() * gestures.length)];

  // Play a sound and display the gesture symbol on the Game Device
  switch (currentGesture) {
    case "U":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Up"
      basic.showArrow(ArrowNames.North);
      break;
    case "D":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Down"
      basic.showArrow(ArrowNames.South);
      break;
    case "L":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Left"
      basic.showArrow(ArrowNames.West);
      break;
    case "R":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Right"
      basic.showArrow(ArrowNames.East);
      break;
    case "CW":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Clockwise"
      basic.showIcon(IconNames.Happy);
      break;
    case "ACW":
      music.playTone(Note.E5, music.beat(BeatFraction.Half)); // Unique sound for "Anti-clockwise"
      basic.showIcon(IconNames.Sad);
      break;
  }
}

function listenForGestures() {
  grove.onGesture(GroveGesture.Clockwise, function () {
    checkAndScoreGesture(CW);
  });
  grove.onGesture(GroveGesture.Anticlockwise, function () {
    checkAndScoreGesture(ACW);
  });
  grove.onGesture(GroveGesture.Up, function () {
    checkAndScoreGesture(U);
  });
  grove.onGesture(GroveGesture.Down, function () {
    checkAndScoreGesture(D);
  });
  grove.onGesture(GroveGesture.Left, function () {
    checkAndScoreGesture(L);
  });
  grove.onGesture(GroveGesture.Right, function () {
    checkAndScoreGesture(R);
  });
}

function checkAndScoreGesture(gesture: string) {
  if (
    gameActive &&
    currentGesture == gesture &&
    input.runningTime() - lastGestureTime >= 500
  ) {
    lastGestureTime = input.runningTime();
    score++;
    display.show(score); // Display the score on the 4-digit display
    gestureScored = true;
    music.playTone(Note.C, music.beat(BeatFraction.Whole)); // Sound on correct gesture
  }
}

function startGame(receivedName: string) {
  gameActive = true;
  playerName = receivedName;
  score = 0;
  basic.showString(playerName);
  lastGestureTime = input.runningTime();
  music.playTone(Note.C5, music.beat(BeatFraction.Double)); // Sound when the game starts

  // Start listening for gestures
  listenForGestures();

  control.inBackground(() => {
    while (gameActive) {
      displayGesture();
      let elapsedTime = 0;
      while (!gestureScored && elapsedTime < 3000) {
        basic.pause(500); // Check every 500 milliseconds
        elapsedTime += 500;
      }
    }
  });

  control.inBackground(() => {
    while (gameActive) {
      measureDistance();
      basic.pause(1000); // Check every 1 second
    }
  });

  // Timer to end the game after a certain duration
  control.inBackground(() => {
    basic.pause(180000); // Pause for 180 seconds (3 minutes)
    if (gameActive) {
      endGame(); // End the game
    }
  });
}

// Measure distance using grove ultrasonic ranger, if player is < 20cm away from device, reset score and play sound
function measureDistance() {
  let distance = grove.measureInCentimeters(DigitalPin.P0);
  if (distance < 20) {
    music.playTone(659, music.beat(BeatFraction.Breve));
    score = 0;
    display.show(score);
  }
}

function endGame() {
  let device_id = "1";

  gameActive = false;
  music.playTone(Note.G5, music.beat(BeatFraction.Double)); // Sound when the game ends
  radio.sendString("END"); // Inform the controller that the game has ended
  basic.showString("End");
  basic.showString("Score: " + score);

  radio.sendString(`ID:${device_id}`);
  radio.sendString(`NAME:${playerName}`);
  radio.sendString(`SCORE:${score}`);
}

function resetGameState() {
  score = 0;
  gameActive = false;
  playerName = "";
  currentGesture = "";
  gestureScored = false;
  lastGestureTime = 0;
  basic.clearScreen();
  display.show(score); // Reset the 4-digit display
  music.playTone(Note.B5, music.beat(BeatFraction.Half));
}

input.onButtonPressed(Button.AB, function () {
  if (gameActive) {
    endGame();
    resetGameState();
  }
});

radio.onReceivedString(function (receivedString: string) {
  if (receivedString.indexOf("START:") === 0) {
    playerName = receivedString.slice("START:".length);
    startGame(playerName);
  }
});

basic.forever(function () {
  if (!gameActive) {
    basic.showIcon(IconNames.Heart); // Show a heart when waiting to start a game
  }
});
