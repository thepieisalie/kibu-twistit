require('./rootRequire');
var util = require('util');

var Chance = require('chance');
var async = require('async');
var _ = require('lodash');


var inputMock = rootRequire('inputMock');
var taskEmitter = rootRequire('taskEmitter');
var constants = rootRequire('constants');

var chance = new Chance();

var GAME_OVER_TYPES = constants.GAME_OVER_TYPES;
var TASKS = constants.TASKS;

var player = {
  score: 0
};

var turnLimit = 10000;

function isGameRunning() {
  return gameRunning;
}

function game() {
  console.log('Twist it started!');
  gameRunning = true;
  async.whilst(isGameRunning, doTurn, onGameEnd);
}

function doTurn(cb) {
  var randomTask = chance.pick(_.values(TASKS));
  console.log('------------');
  console.log('[index/doTurn] randomTask is:', randomTask);

  var timeLimit = setTimeout(function() {
    return cb(GAME_OVER_TYPES.TIMEOUT);
  }, turnLimit);

  taskEmitter.once('onInputTask', function(inputTask) {
    console.log('[index/onInputTask] inputTask:', inputTask);
    console.log('[index/onInputTask] random task:', randomTask);
    if (inputTask === randomTask) {
      player.score++;
      console.log('[index/onInputTask] Correct task. Score is:', player.score);
      clearTimeout(timeLimit);
      return cb();
    }
    return cb(GAME_OVER_TYPES.WRONG_TASK);
  });
}

function onGameEnd(err) {
  gameRunning = false;
  switch (err) {
    case GAME_OVER_TYPES.TIMEOUT:
      console.log('[index/onGameEnd] Game over, timeout! Score is:', player.score);
      break;
    case GAME_OVER_TYPES.WRONG_TASK:
      console.log('[index/onGameEnd] Game over, wrong task! Score is:', player.score);
      break;
    default:
      console.log('[index/onGameEnd] Uh oh:', err);
  }
  process.exit(0);
}

game();
