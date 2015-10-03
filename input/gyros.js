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


var mpu6050 = require('./mpu6050.js');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();

setInterval(function() {
  mpu.getMotion6(function(err, data) {
    var g = data.slice(3).map(function(n) { return n / 250; });
    gyrosEmitter.emit('onGyros', g);
  });
}, 1);

process.on('SIGINT', function exit() {
  mpu.setSleepEnabled(1);
});
