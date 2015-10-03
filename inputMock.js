var keypress = require('keypress');

var constants = rootRequire('constants');
var taskEmitter = rootRequire('taskEmitter');
var buttonEmitter = rootRequire('input/buttons');
var gyrosEmitter = rootRequire('input/gyros');
var lightEmitter = rootRequire('input/light');
var potEmitter = rootRequire('input/pot');
var humidityEmitter = rootRequire('input/humidity');

var TASKS = constants.TASKS;
var GYROS_THRESHOLD = constants.GYROS_THRESHOLD;
var HUMIDITY_THRESHOLD = constants.HUMIDITY_THRESHOLD;

keypress(process.stdin);

// simulate gyros
var gyrosInterval = setInterval(function () {
  gyrosEmitter.emit('onGyros', [0, 0, 0]);
}, 200);

// simulate light
var lightInterval = setInterval(function () {
  lightEmitter.emit('onLight', false);
}, 200);

var keyToTask = {
  a: function () { lightEmitter.emit('onLight', true); },
  s: function () { buttonEmitter.emit('onButton', 1); },
  d: function () { buttonEmitter.emit('onButton', 2); },
  f: function () { buttonEmitter.emit('onButton', 3); },
  g: function () { buttonEmitter.emit('onButton', 4); },
  h: function () { humidityEmitter.emit('onHumidity', HUMIDITY_THRESHOLD + 1); },
  j: function () { potEmitter.emit('onPot', true); },
  k: function () { potEmitter.emit('onPot', false); },
  l: function () { gyrosEmitter.emit('onGyros', [GYROS_THRESHOLD + 1, 0, 0]); }
};

process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.exit(0);
  }
  console.log('[inputMock/stdinOnKeypress] keyName:', key.name);
  var doTask = keyToTask[key.name];
  doTask();
});

process.stdin.setRawMode(true);
process.stdin.resume();
