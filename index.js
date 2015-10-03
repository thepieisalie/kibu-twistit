require('./rootRequire');
var util = require('util');

var Chance = require('chance');
var async = require('async');
var _ = require('lodash');

// rootRequire('inputMock');
var taskEmitter = rootRequire('taskEmitter');
var buzzerEmitter = rootRequire('output/buzzer');
var lcdEmitter = rootRequire('output/lcd');
var ledEmitter = rootRequire('output/led');
var constants = rootRequire('constants');

var chance = new Chance();

var GAME_OVER_TYPES = constants.GAME_OVER_TYPES;
var TASKS = constants.TASKS;
var BUZZ = constants.BUZZ;

var player = { score: 0 };

var turnLimit = 10000;
var newTaskWaitTime = 2000;
var gameRunning = true;

function isGameRunning() {
  return gameRunning;
}

function game() {
  lcdEmitter.emit('onLcd', 'Twist it started!');
  gameRunning = true;
  async.whilst(isGameRunning, doTurn, onGameEnd);
}

function isHitButtonTask(task) {
  return _.includes([
    TASKS.HIT_BTN1,
    TASKS.HIT_BTN2,
    TASKS.HIT_BTN3,
    TASKS.HIT_BTN4,
  ], task);
}

function doTurn(cb) {
  var randomTask = chance.pick(_.values(TASKS));
  if (isHitButtonTask(randomTask)) {
    lcdEmitter.emit('onLcd', 'Task: how many LED are on?');
    var numberOfLeds = +randomTask.slice(-1);
    var ledIndexes = chance.pick([0, 1, 2, 3], numberOfLeds);
    if (!_.isArray(ledIndexes)) {
      ledIndexes = [ledIndexes];
    }
    var turnedOnLeds = [0, 0, 0, 0].map(function(item, index) {
      return (_.includes(ledIndexes, index));
    });
    ledEmitter.emit('onLed', turnedOnLeds);
  } else {
    lcdEmitter.emit('onLcd', 'Task: ' + randomTask);
  }

  var timeLimit = setTimeout(function() {
    return cb(GAME_OVER_TYPES.TIMEOUT);
  }, turnLimit);

  taskEmitter.once('onInputTask', function(inputTask) {
    if (inputTask === randomTask) {
      player.score++;
      lcdEmitter.emit('onLcd', 'Correct!');
      clearTimeout(timeLimit);
      buzzerEmitter.emit('onBuzz', BUZZ.SHORT);
      turnLimit -= 50;
      newTaskWaitTime -= 20;
      setTimeout(cb, newTaskWaitTime);
    } else {
      return cb(inputTask);
    }
  });
}

function onGameEnd(err) {
  gameRunning = false;
  buzzerEmitter.emit('onBuzz', BUZZ.LONG);
  switch (err) {
    case GAME_OVER_TYPES.TIMEOUT:
      lcdEmitter.emit('onLcd', 'Game over, timeout! Score is: ' + player.score);
      break;
    default:
      lcdEmitter.emit('onLcd', util.format('Game over! You did "%s", Score is: %s', err, player.score));
  }
  process.exit(0);
}

game();
