var events = require('events');

var taskEmitter = new events.EventEmitter();
module.exports = taskEmitter;
