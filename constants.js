var TASKS = {
  COVER_IT: 'cover it',
  HIT_BTN1: 'hit button 1',
  HIT_BTN2: 'hit button 2',
  HIT_BTN3: 'hit button 3',
  HIT_BTN4: 'hit button 4',
  EXHALE: 'exhale',
  TWIST_CLOCKWISE: 'twist clockwise',
  TWIST_COUNTER_CLOCKWISE: 'twist counter clockwise',
  TWIST_IT: 'twist it'
};

var GAME_OVER_TYPES = {
  TIMEOUT: 'timeout',
  WRONG_TASK: 'wrongTask'
};

var BUZZ = {
  SHORT: 'short',
  LONG: 'long'
};

var GYROS_THRESHOLD = 100;

var POT_THRESHOLD = 5;

var HUMIDITY_THRESHOLD = 20;

var MAX_GYROS_STATES = 10;

module.exports = {
  TASKS: TASKS,
  GAME_OVER_TYPES: GAME_OVER_TYPES,
  GYROS_THRESHOLD: GYROS_THRESHOLD,
  POT_THRESHOLD: POT_THRESHOLD,
  HUMIDITY_THRESHOLD: HUMIDITY_THRESHOLD,
  BUZZ: BUZZ,
  MAX_GYROS_STATES: MAX_GYROS_STATES
};
