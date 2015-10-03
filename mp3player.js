var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

module.exports = function (path, cb) {
  fs.createReadStream(path)
    .pipe(new lame.Decoder())
    .on('format', function (format) {
      this.pipe(new Speaker(format));
    })
    .on('end', function() {
      if (cb && typeof cb === 'function') {
        cb();
      }
    });
}
