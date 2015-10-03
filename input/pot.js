var events = require('events');

var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');
var config = rootRequire('config');

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

if (config.env !== 'dev') {
  var Gpio = require('onoff').Gpio;

  var potCLK = new Gpio(16, 'in', 'both');
  var potDT = new Gpio(20, 'in', 'both');
  var potSW = new Gpio(21, 'in', 'both');

  var buttonDown = false;

  var clkOldState = 1;
  var dtOldState = 1;

var clkOldState = 1;
var dtOldState = 1;

setTimeout(function checker() {
  var swState = potSW.readSync();
  if (swState && buttonDown) {
    buttonDown = false;
    //console.log('Button up');
  } else if (!swState && !buttonDown) {
    buttonDown = true;
    //console.log('Button down');
  }

    var clkState = potCLK.readSync();
    var dtState = potDT.readSync();

    if ((clkOldState && !clkState) || (dtOldState && !dtState)) {
      var sum = '' + clkOldState + dtOldState + clkState + dtState;
      if (sum === '1101' || sum === '0100' || sum === '0010' || sum === '1011') {
        potEmitter.emit('onPot', true);
        //console.log('CW');
      } else if (sum === '1110' || sum === '0111' || sum === '0001' || sum === '1000') {
        potEmitter.emit('onPot', false);
        //console.log('CCW');
      }
    }

    clkOldState = clkState;
    dtOldState = dtState;

    setTimeout(checker);
  });

  process.on('SIGINT', function exit() {
    potCLK.unexport();
    potDT.unexport();
    potSW.unexport();
    process.exit();
  });
}
