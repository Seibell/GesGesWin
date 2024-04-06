radio.setGroup(240); // Ensure this matches your game device's radio group

serial.redirect(SerialPin.USB_TX, SerialPin.USB_RX, BaudRate.BaudRate115200);

radio.onReceivedString(function (receivedString) {
  // Relay received data over serial to the PC
  serial.writeString(receivedString + "\n");

  // Temporarily show a different icon to indicate data reception
  basic.showIcon(IconNames.Yes);
  basic.pause(500); // Pause to ensure the icon is visible
  basic.showIcon(IconNames.Heart); // Return to the default active state icon
});

basic.forever(function () {
  // Show a heart icon to indicate the receiver is active and waiting for data
  basic.showIcon(IconNames.Heart);
});
