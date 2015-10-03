var events = require('events');

var lcdEmitter = new events.EventEmitter();

lcdEmitter.on('onLcd', function(text) {
  console.log('[lcdEmitter] text:', text);
});

module.exports = lcdEmitter;
