radio.setGroup(240);
serial.redirect(SerialPin.USB_TX, SerialPin.USB_RX, BaudRate.BaudRate115200);

radio.onReceivedString(function (receivedString) {
  // Relay received data over serial to the PC
  serial.writeString(receivedString + "\n");

  basic.showIcon(IconNames.Yes);
  basic.pause(500);
  basic.showIcon(IconNames.Heart);
});

basic.forever(function () {
  // Show a heart icon to indicate the receiver is active and waiting for data
  basic.showIcon(IconNames.Heart);
});
