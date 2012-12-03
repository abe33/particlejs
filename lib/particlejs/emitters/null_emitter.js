(function() {
  var NullEmitter, Point, geomjs;

  geomjs = require('geomjs');

  Point = geomjs.Point;

  NullEmitter = (function() {

    function NullEmitter() {}

    NullEmitter.prototype.get = function() {
      return new Point;
    };

    return NullEmitter;

  })();

  module.exports = NullEmitter;

}).call(this);
