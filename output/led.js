var events = require('events');

var ledEmitter = new events.EventEmitter();

ledEmitter.on('onLed', function (turnedOnLeds) {
  console.log('[ledEmitter] turnedOnLeds:', turnedOnLeds);
});

module.exports = ledEmitter;
