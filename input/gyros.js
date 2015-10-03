var events = require('events');

var _ = require('lodash');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var gyrosEmitter = new events.EventEmitter();
var TASKS = constants.TASKS;
var GYROS_THRESHOLD = constants.GYROS_THRESHOLD;
var MAX_GYROS_STATES = constants.MAX_GYROS_STATES;

var gyrosStates = { x: [], y: [], z: [] };

gyrosEmitter.on('onGyros', function(gyrosState) {
  addGyros(gyrosState);
  if (isMoving()) {
    taskEmitter.emit('onInputTask', TASKS.TWIST_IT);
  }
});

function addGyros(gyrosState) {
  if (gyrosStates.x.length > 9) {
    _.keys(gyrosStates).forEach(function (key) {
      gyrosStates[key].shift();
    });
  }
  gyrosStates.x.push(gyrosState[0]);
  gyrosStates.y.push(gyrosState[1]);
  gyrosStates.z.push(gyrosState[2]);
}

function isMoving() {
  var allDiff = 0;
  if (gyrosStates.x.length < MAX_GYROS_STATES) {
    return false;
  }
  _.keys(gyrosStates).forEach(function (key) {
    var theDiff = gyrosStates[key].reduce(function (state, value, index) {
      if (index + 1 === gyrosStates[key].length) {
        return state;
      }
      var nextItem = gyrosStates[key][index + 1];
      var diff = Math.abs(value - nextItem);
      return state + diff;
    }, 0);
    allDiff += theDiff;
  });
  return allDiff > GYROS_THRESHOLD;
}

module.exports = gyrosEmitter;
