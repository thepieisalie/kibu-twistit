var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var TASKS = constants.TASKS;
var lightEmitter = new events.EventEmitter();

var lightTransition = [];

lightEmitter.on('onLight', function (isDark) {
  addTransition(isDark);
  if (isLightToDark()) {
    console.log(isDark);
    taskEmitter.emit('onInputTask', TASKS.COVER_IT);
  }
});

function addTransition(isDark) {
  if (lightTransition.length > 1) {
    lightTransition.shift();
  }
  lightTransition.push(isDark);
}

function isLightToDark() {
  return !lightTransition[0] && lightTransition[1];
}

module.exports = lightEmitter;


var Gpio = require('onoff').Gpio;
var photo  = new Gpio(4, 'in', 'both');

photo.watch(function(err, value) {
  lightEmitter.emit('onLight', value);
});

process.on('SIGINT', function exit() {
  photo.unexport();
});
