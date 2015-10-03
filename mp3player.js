var fs = require('fs');
var exec = require('child_process').exec;

var lame = require('lame');
var Speaker = require('speaker');

module.exports = function (path, cb) {
  var cmd = 'mpg123 ' + path;
  exec(cmd, function(error, stdout, stderr) {
    if (cb && typeof cb === 'function') {
      cb();
    }
});
}
