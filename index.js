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

var mp3player = rootRequire('mp3player');

rootRequire('input/buttons');
rootRequire('input/gyros');
rootRequire('input/light');
rootRequire('input/pot');
rootRequire('input/humidity');

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

function doTurn(cb) {
  var chance = new Chance();
  var randomTask = chance.pick(_.values(TASKS));
  mp3player('./assets/music/' + randomTask + '.mp3');
  if (TASKS.HIT_BTN === randomTask) {
    lcdEmitter.emit('onLcd', 'Task: how many LED are on?');
    var numberOfLeds = chance.pick([1, 2, 3, 4]);
    var ledIndexes = chance.pick([0, 1, 2, 3], numberOfLeds);
    if (!_.isArray(ledIndexes)) {
      ledIndexes = [ledIndexes];
    }
    var turnedOnLeds = [0, 0, 0, 0].map(function(item, index) {
      return (_.includes(ledIndexes, index));
    });
    console.log('turnedOnLeds', turnedOnLeds);

    var buttonNum = 0;
    turnedOnLeds.forEach(function (item) {
      if (item) {
        return buttonNum++;
      }
    });
    randomTask += '' + buttonNum;
    console.log('randomTask', randomTask);
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
      mp3player('./assets/music/coin.mp3');
      setTimeout(cb, newTaskWaitTime);
    } else {
      return cb(inputTask);
    }
  });
}

function onGameEnd(err) {
  gameRunning = false;
  mp3player('./assets/music/gameOver.mp3');
  buzzerEmitter.emit('onBuzz', BUZZ.LONG);
  switch (err) {
    case GAME_OVER_TYPES.TIMEOUT:
      lcdEmitter.emit('onLcd', 'Game over, timeout! Score is: ' + player.score);
      break;
    default:
      lcdEmitter.emit('onLcd', util.format('Game over! You did "%s", Score is: %s', err, player.score));
  }
  setTimeout(function() { process.exit(0); }, 7000);
}

game();
