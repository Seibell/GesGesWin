radio.setGroup(1);
let score = 0;
let gameActive = false;
let playerName = "";
let currentGesture = ""; // Variable to store the currently expected gesture
let gestureScored = false; // Track if a point has been scored for the current gesture

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

function startGame(receivedName: string) {
  gameActive = true;
  playerName = receivedName;
  score = 0;
  basic.showString(playerName);
  music.playTone(Note.C5, music.beat(BeatFraction.Double)); // Sound when the game starts

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

  // Timer to end the game after a certain duration
  control.inBackground(() => {
    basic.pause(180000); // Pause for 180 seconds (3 minutes)
    if (gameActive) {
      endGame(); // End the game
    }
  });
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
  basic.clearScreen();
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
  } else if (
    gameActive &&
    receivedString === currentGesture &&
    !gestureScored
  ) {
    gestureScored = true; // Ensure only 1 point can be scored per gesture
    score++;
    radio.sendString("S: " + score); // Send the updated score to the controller
    music.playTone(Note.C, music.beat(BeatFraction.Whole)); // Sound on correct gesture
  } else if (receivedString === "END") {
    gameActive = false;
  } else if (receivedString.indexOf("D:") == 0 && gameActive) {
    let distance = parseInt(receivedString.split(":")[1]);
    if (distance < 20) {
      music.playTone(Note.F5, music.beat(BeatFraction.Double)); // Sound when the distance is less than 20 cm
      score = 0; // Reset the score if the distance is less than 20 cm
    }
  }
});

basic.forever(function () {
  if (!gameActive) {
    basic.showIcon(IconNames.Heart); // Show a heart when waiting to start a game
  }
});
