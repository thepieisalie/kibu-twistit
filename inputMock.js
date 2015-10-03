var keypress = require('keypress');

var constants = rootRequire('constants');
var buttonEmitter = rootRequire('input/buttons');
var gyrosEmitter = rootRequire('input/gyros');
var lightEmitter = rootRequire('input/light');
var potEmitter = rootRequire('input/pot');
var humidityEmitter = rootRequire('input/humidity');

var GYROS_THRESHOLD = constants.GYROS_THRESHOLD;
var HUMIDITY_THRESHOLD = constants.HUMIDITY_THRESHOLD;

keypress(process.stdin);

// simulate gyros
setInterval(function () {
  gyrosEmitter.emit('onGyros', [0, 0, 0]);
}, 200);

// simulate light
setInterval(function () {
  lightEmitter.emit('onLight', false);
}, 200);

var keyToTask = {
  l: function () { lightEmitter.emit('onLight', true); },
  q: function () { buttonEmitter.emit('onButton', 1); },
  w: function () { buttonEmitter.emit('onButton', 2); },
  e: function () { buttonEmitter.emit('onButton', 3); },
  r: function () { buttonEmitter.emit('onButton', 4); },
  h: function () { humidityEmitter.emit('onHumidity', HUMIDITY_THRESHOLD + 1); },
  j: function () { potEmitter.emit('onPot', true); },
  b: function () { potEmitter.emit('onPot', false); },
  g: function () { gyrosEmitter.emit('onGyros', [GYROS_THRESHOLD + 1, 0, 0]); }
};

process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name === 'c') {
    process.exit(0);
  }
  var doTask = keyToTask[key.name];
  doTask();
});

process.stdin.setRawMode(true);
process.stdin.resume();
