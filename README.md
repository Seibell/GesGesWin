## IS4151 Assignment 1 (GesGesWin+ System)

### Parts:

- **Display**

  - Shows a welcome splash screen.
  - Displays the latest player score table, including device ID, player name, and score sorted in the required order.

- **Game Device**

  - Shows a welcome splash screen.
  - Resets the score to 0.
  - Displays player name.
  - Starts game play.
  - Randomly generates one of six gestures – left, right, up, down, clockwise, or anti-clockwise.
  - Displays the current gesture on the 5x5 LEDs with an appropriate symbol.
  - The player has 3 seconds to make the correct gesture to score one point.
  - If after 3 seconds, the user cannot let the gesture sensor detect the correct gesture, the player will not get any point.
  - The gameplay continues with the random generation of the next gesture, or as soon as the player has made the correct gesture.
    - That is, the maximum waiting time for each gesture is 3 seconds if the player cannot make the correct gesture. But if the player makes the correct gesture, gameplay should continue immediately with the next random gesture.
    - The generation of each new random gesture should be accompanied by a suitable audio tone or clearing of the 5x5 LEDs such that the player is aware if the next new random gesture is the same as the previous one.
    - The current score should be displayed to the player at all times throughout the gameplay.
    - The player must stand at least 20 cm away from the device at all times during gameplay.
    - If the device detects the player to be less than 20 cm away, the device should sound a warning tone and reset the player’s score to 0.
    - At the end of 3 minutes or 180 seconds, the game will end, and the device will display the player’s final score.
    - Transmits the device identifier, player name, and player score to the wireless receiver.

- **Receiver**

  - Receives the device identifier, player name, and player score from the game device.
  - Relays the information to the display program.

- **Remote**
  - Shows a welcome splash screen.
  - Prompts player to press button A to start game.
  - Prompts player to input name.
