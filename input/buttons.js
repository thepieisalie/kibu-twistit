var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');
var config = rootRequire('config');

var buttonEmitter = new events.EventEmitter();
var TASKS = constants.TASKS;

function pressedKeyToTask(pressedKey) {
  return TASKS.HIT_BTN + (pressedKey + 1)
}

buttonEmitter.on('onButton', function(pressedKey) {
  var task = pressedKeyToTask(pressedKey);
  if (task) {
    return taskEmitter.emit('onInputTask', task);
  }
});

module.exports = buttonEmitter;

if (config.env !== 'dev') {
  var Gpio = require('onoff').Gpio;
  var buttonOut = new Gpio(5, 'out');
  var buttons = [
    new Gpio(6, 'in', 'falling'),
    new Gpio(13, 'in', 'falling'),
    new Gpio(19, 'in', 'falling'),
    new Gpio(26, 'in', 'falling'),
  ];

  var buttonState = [0, 0, 0, 0];

  setInterval(function() {
    var arr = [0, 0, 0, 0];
    buttonOut.writeSync(0);
    arr[1] = buttons[0].readSync() === 0;
    buttonOut.writeSync(1);
    arr[0] = buttons[1].readSync() === 1;
    arr[2] = buttons[3].readSync() === 1;
    arr[3] = buttons[2].readSync() === 1;

    for(var i = 0; i < 4; i++) {
      if(buttonState[i] && !arr[i]) {
        buttonEmitter.emit('onButton', i);
      }
    }

    buttonState = arr;
  }, 20);

  process.on('SIGINT', function exit() {
    buttonOut.unexport();
    buttons.forEach(function(b) { b.unexport(); });
  });
}
