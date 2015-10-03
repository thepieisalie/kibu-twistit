#!/usr/local/bin/node

var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var Gpio = require('onoff').Gpio;
var potSW = new Gpio(21, 'in', 'both');

var leds = [
  new Gpio(17, 'out'),
  new Gpio(18, 'out'),
  new Gpio(22, 'out'),
  new Gpio(27, 'out'),
];

leds.forEach(function(l) {
  l.writeSync(1);
});

setTimeout(function() {
  leds.forEach(function(l) {
    l.writeSync(0);
  });


  var running = false;
  potSW.watch(function() {
    if(running) { return; }
    console.log('>>>>>> Starting sub!');

    var child = fork('./index.js');

    child.on('close', function() {
      console.log('>>>>>> End sub!');
      running = false;
    });

    running = true;
});

}, 500);
