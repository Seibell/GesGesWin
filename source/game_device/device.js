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
      music.playTone(Note.D5, music.beat(BeatFraction.Half)); // Unique sound for "Down"
      basic.showArrow(ArrowNames.South);
      break;
    case "L":
      music.playTone(Note.F5, music.beat(BeatFraction.Half)); // Unique sound for "Left"
      basic.showArrow(ArrowNames.West);
      break;
    case "R":
      music.playTone(Note.G5, music.beat(BeatFraction.Half)); // Unique sound for "Right"
      basic.showArrow(ArrowNames.East);
      break;
    case "CW":
      music.playTone(Note.A5, music.beat(BeatFraction.Half)); // Unique sound for "Clockwise"
      basic.showIcon(IconNames.Happy);
      break;
    case "ACW":
      music.playTone(Note.B5, music.beat(BeatFraction.Half)); // Unique sound for "Anti-clockwise"
      basic.showIcon(IconNames.Sad);
      break;
  }
}

function startGame(receivedName: string) {
  gameActive = true;
  playerName = receivedName;
  score = 0;
  basic.showString("Hi " + playerName + "!");
  music.playTone(Note.C5, music.beat(BeatFraction.Double)); // Sound when the game starts

  control.inBackground(() => {
    while (gameActive) {
      displayGesture();
      basic.pause(3000); // Each gesture is shown for 3 seconds before the next
    }
  });

  // Timer to end the game after 180 seconds
  control.inBackground(() => {
    basic.pause(18000); // Pause for 180 seconds (3 minutes)
    if (gameActive) {
      endGame(); // End the game
    }
  });
}

function endGame() {
  gameActive = false;
  music.playTone(Note.G5, music.beat(BeatFraction.Double)); // Sound when the game ends
  basic.showString("End");
  basic.showString("Score: " + score);
  radio.sendString("GAME END"); // Inform the controller that the game has ended

  let device_id = "GameDevice1";
  radio.sendString(`E,ID:${device_id},N:${playerName},S:${score}`);
}

radio.onReceivedString(function (receivedString: string) {
  if (receivedString.indexOf("START,Name:") === 0) {
    playerName = receivedString.slice("START,Name:".length);
    startGame(playerName);
  } else if (
    gameActive &&
    receivedString === currentGesture &&
    !gestureScored
  ) {
    gestureScored = true; // Ensure only 1 point can be scored per gesture
    score++;
    music.playTone(Note.C, music.beat(BeatFraction.Whole)); // Sound on correct gesture
  } else if (receivedString === "GAME END") {
    gameActive = false;
  }
});

basic.forever(function () {
  if (!gameActive) {
    basic.showIcon(IconNames.Heart); // Show a heart when waiting to start a game
  }
});
