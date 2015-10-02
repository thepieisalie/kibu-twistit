var keypress = require('keypress');

var taskEmitter = require('./taskEmitter');
var constants = require('./constants');

var TASKS = constants.TASKS;

keypress(process.stdin);

var keyToTask = {
  a: TASKS.COVER_IT,
  s: TASKS.HIT_BTN1,
  d: TASKS.HIT_BTN2,
  f: TASKS.HIT_BTN3,
  g: TASKS.HIT_BTN4,
  h: TASKS.EXHALE,
  j: TASKS.TWIST_CLOCKWISE,
  k: TASKS.TWIST_COUNTER_CLOCKWISE,
  l: TASKS.TWIST_IT
};

process.stdin.on('keypress', function (ch, key) {
  console.log('[inputMock/stdinOnKeypress] keyName:', key.name);
  var task = keyToTask[key.name];
  console.log('[inputMock/stdinOnKeypress] task:', task);
  if (task) {
    console.log('[inputMock/stdinOnKeypress] onInputTask emitted.');
    taskEmitter.emit('onInputTask', task);
  }
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
