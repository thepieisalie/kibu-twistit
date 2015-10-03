var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');
var config = rootRequire('config');

var TASKS = constants.TASKS;
var HUMIDITY_THRESHOLD = constants.HUMIDITY_THRESHOLD;
var humidityEmitter = new events.EventEmitter();

humidityEmitter.on('onHumidity', function(humidity) {
  if (humidity > HUMIDITY_THRESHOLD) {
    taskEmitter.emit('onInputTask', TASKS.EXHALE);
  }
});

module.exports = humidityEmitter;

if (config.env !== 'dev') {
  var sensorLib = require('node-dht-sensor');

  var sensor = {
    initialize: function () {
      return sensorLib.initialize(22, 12);
    },
    read: function () {
      var readout = sensorLib.read();

      humidityEmitter.emit('onHumidity', readout.humidity.toFixed(2));

      // console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' + 'humidity: ' + readout.humidity.toFixed(2) + '%');
      setTimeout(function () {
        sensor.read();
      }, 100);
    }
  };

  if (sensor.initialize()) {
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor');
  }
}
