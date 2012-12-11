(function() {
  var Cloneable, Fixed, Inlinable, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Fixed = (function() {

    include([
      Inlinable({
        inlinedProperties: ['count'],
        mapSource: {
          prepare: 'count = this.count;'
        }
      }), Cloneable('count'), Sourcable('particlejs.Fixed', 'count')
    ])["in"](Fixed);

    function Fixed(count) {
      this.count = count != null ? count : 1;
    }

    Fixed.prototype.prepare = function() {};

    return Fixed;

  })();

  module.exports = Fixed;

}).call(this);
