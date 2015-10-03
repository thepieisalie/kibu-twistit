var events = require('events');

var constants = rootRequire('constants');

var BUZZ = constants.BUZZ;
var buzzerEmitter = new events.EventEmitter();

buzzerEmitter.on('onBuzz', function(length) {
  switch (length) {
    case BUZZ.SHORT:
      console.log('[buzzerEmitter] short buzz');
      break;
    case BUZZ.LONG:
      console.log('[buzzerEmitter] long buzz');
      break;
    default:
      console.error('[buzzerEmitter] Uh oh:', length);
  }
});

module.exports = buzzerEmitter;
