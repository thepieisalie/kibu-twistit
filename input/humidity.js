var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var TASKS = constants.TASKS;
var HUMIDITY_THRESHOLD = constants.HUMIDITY_THRESHOLD;
var humidityEmitter = new events.EventEmitter();

humidityEmitter.on('onHumidity', function(humidity) {
  if (humidity > HUMIDITY_THRESHOLD) {
    taskEmitter.emit('onInputTask', TASKS.EXHALE);
  }
});

module.exports = humidityEmitter;
