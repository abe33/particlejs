(function() {
  var ByRate, Cloneable, Inlinable, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  ByRate = (function() {

    include([
      Inlinable({
        inlinedProperties: ['rate'],
        keywords: ['count'],
        mapSource: {
          constructor: 'this.rest = @rest;\nthis.offset = @offset;'
        }
      }), Cloneable('rate'), Sourcable('particlejs.ByRate', 'rate')
    ])["in"](ByRate);

    function ByRate(rate) {
      this.rate = rate != null ? rate : 1;
      this.count = 0;
      this.rest = 0;
      this.offset = 1;
    }

    ByRate.prototype.prepare = function(bias, biasInSeconds, time) {
      this.rest += biasInSeconds * this.rate;
      this.count = Math.floor(this.rest);
      this.rest -= this.count;
      this.count += this.offset;
      return this.offset = 0;
    };

    return ByRate;

  })();

  module.exports = ByRate;

}).call(this);
