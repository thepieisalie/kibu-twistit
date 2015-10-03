require('./rootRequire');
var util = require('util');
var fs = require('fs');

var Chance = require('chance');
var async = require('async');
var _ = require('lodash');
var say = require('say');

var config = rootRequire('config');
if (config.env === 'dev') { rootRequire('inputMock'); }

var taskEmitter = rootRequire('taskEmitter');
var buzzerEmitter = rootRequire('output/buzzer');
var lcdEmitter = rootRequire('output/lcd');
var ledEmitter = rootRequire('output/led');
var constants = rootRequire('constants');
var mp3player = rootRequire('mp3player');

var highscore = { value: 0 };
try {
  highscore = rootRequire('highscore.json');
} catch(e) {}

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
var announceHighscorePass = true;
var timeLimit;

function isGameRunning() {
  return gameRunning;
}

function game() {
  lcdEmitter.emit('onLcd', util.format('Twist it started in %s mode!', config.env));
  mp3player('./assets/music/welcome.mp3');
  setTimeout(function() {
    say.speak(null, util.format('The current highscore is %s. Good luck.', highscore.value), function () {
      gameRunning = true;
      async.whilst(isGameRunning, doTurn, onGameEnd);
    });
  }, 7000);
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

  timeLimit = setTimeout(function() {
    return cb(GAME_OVER_TYPES.TIMEOUT);
  }, turnLimit);

  taskEmitter.once('onInputTask', function(inputTask) {
    ledEmitter.emit('onLed', [false, false, false, false]);
    if (inputTask === randomTask) {
      player.score++;
      if (player.score > highscore.value) {
        if (announceHighscorePass) {
          say.speak(null, 'You passed the highscore.', afterAnnounce);
        } else {
          afterAnnounce();
        }
      } else {
        afterAnnounce();
      }
      function afterAnnounce() {
        if (player.score > highscore.value) {
          announceHighscorePass = false;
          highscore.value = player.score;
        }
        lcdEmitter.emit('onLcd', 'Correct!');
        clearTimeout(timeLimit);
        buzzerEmitter.emit('onBuzz', BUZZ.SHORT);
        turnLimit -= 50;
        newTaskWaitTime -= 20;
        mp3player('./assets/music/coin.mp3');
        setTimeout(cb, newTaskWaitTime);
      }
    } else {
      clearTimeout(timeLimit);
      return cb(inputTask);
    }
  });
}

function onGameEnd(err) {
  clearTimeout(timeLimit);
  gameRunning = false;
  fs.writeFile('highscore.json', JSON.stringify({ value: highscore.value }), function (err) {
    if (err) {
      console.error('Error saving highscore.');
    }
  });
  mp3player('./assets/music/gameOver.mp3', function () {
    say.speak(null, util.format('Game over. Your score is %s, good bye.', player.score), function () {
      setTimeout(function() { process.exit(0); }, 2000);
    });
  });
  buzzerEmitter.emit('onBuzz', BUZZ.LONG);
  switch (err) {
    case GAME_OVER_TYPES.TIMEOUT:
      lcdEmitter.emit('onLcd', 'Game over, timeout! Score is: ' + player.score);
      break;
    default:
      lcdEmitter.emit('onLcd', util.format('Game over! You did "%s", Score is: %s', err, player.score));
  }
}

game();
