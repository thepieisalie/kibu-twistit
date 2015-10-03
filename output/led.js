var events = require('events');

var config = rootRequire('config');

var ledEmitter = new events.EventEmitter();

ledEmitter.on('onLed', function (turnedOnLeds) {
  turnedOnLeds.forEach(function(b, i) {
    if (config.env !== 'dev') {
      leds[i].writeSync(b ? 1 : 0);
    }
  });
});

module.exports = ledEmitter;

if (config.env !== 'dev') {
  var Gpio = require('onoff').Gpio;
  var leds = [
    new Gpio(17, 'out'),
    new Gpio(18, 'out'),
    new Gpio(22, 'out'),
    new Gpio(27, 'out'),
  ];

  function exit() {
    leds.forEach(function(l) {
      l.writeSync(0);
      l.unexport();
    });
  }

  process.on('SIGINT', exit);
}
