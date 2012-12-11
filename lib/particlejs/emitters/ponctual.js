(function() {
  var Cloneable, Inlinable, Point, Ponctual, Sourcable, geomjs, include, mixinsjs;

  geomjs = require('geomjs');

  mixinsjs = require('mixinsjs');

  Point = geomjs.Point;

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Ponctual = (function() {

    include([
      Inlinable({
        noconstructor: true,
        inlinedProperties: ['point'],
        mapSource: {
          get: 'return this.point;'
        }
      }), Cloneable('point'), Sourcable('particlejs.Ponctual', 'point')
    ])["in"](Ponctual);

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
