radio.setGroup(240);
let gameActive = false;

input.onButtonPressed(Button.A, function () {
  if (!gameActive) {
    gameActive = true;
    simulateGame();
  }
});

function simulateGame() {
  let playerName = generateRandomName();
  let score = Math.floor(Math.random() * 101);
  basic.showString("Name: " + playerName);
  basic.showString("Score: " + score.toString());

  // END
  radio.sendString("END_SIM");
  radio.sendString("ID:2");
  radio.sendString("NAME:" + playerName);
  radio.sendString("SCORE:" + score.toString());

  basic.pause(2000); // Pause for 2 seconds before resetting
  gameActive = false;
}

function generateRandomName() {
  let name = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 5; i++) {
    name += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return name;
}
