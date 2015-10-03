var events = require('events');

var _ = require('lodash');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var TASKS = constants.TASKS;
var POT_THRESHOLD = constants.POT_THRESHOLD;
var potEmitter = new events.EventEmitter();
var bias = 0;

potEmitter.on('onPot', function (isClockwise) {
  if (isClockwise) {
    bias++;
  } else {
    bias--;
  }
  if (bias === POT_THRESHOLD) {
    bias = 0;
    taskEmitter.emit('onInputTask', TASKS.TWIST_CLOCKWISE);
  } else if (bias === (-1) * POT_THRESHOLD) {
    bias = 0;
    taskEmitter.emit('onInputTask', TASKS.TWIST_COUNTER_CLOCKWISE);
  }
});

module.exports = potEmitter;
