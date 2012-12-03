(function() {
  var Point, Ponctual, geomjs;

  geomjs = require('geomjs');

  Point = geomjs.Point;

  Ponctual = (function() {

    function Ponctual(point) {
      this.point = point != null ? point : new Point;
    }

    Ponctual.prototype.get = function() {
      return this.point.clone();
    };

    return Ponctual;

  })();

  module.exports = Ponctual;

}).call(this);
