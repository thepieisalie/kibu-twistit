var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var buttonEmitter = new events.EventEmitter();
var TASKS = constants.TASKS;

var pressedKeyToTask = {
  1: TASKS.HIT_BTN1,
  2: TASKS.HIT_BTN2,
  3: TASKS.HIT_BTN3,
  4: TASKS.HIT_BTN4
};

buttonEmitter.on('onButton', function(pressedKey) {
  var task = pressedKeyToTask[pressedKey];
  if (task) {
    return taskEmitter.emit('onInputTask', task);
  }
});

module.exports = buttonEmitter;
