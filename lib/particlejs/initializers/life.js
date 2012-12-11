(function() {
  var Cloneable, Inlinable, Life, Randomizable, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Randomizable = require('../mixins/randomizable');

  Life = (function() {

    include([
      Inlinable({
        inlinedProperties: ['lifeMin', 'lifeMax'],
        mapSource: {
          constructor: 'this.random = @random;',
          initialize: function() {
            if (this.lifeMax === this.lifeMin) {
              return 'particle.maxLife = @lifeMin;';
            } else {
              return 'particle.maxLife = this.random["in"](@lifeMin, @lifeMax);';
            }
          }
        }
      }), Cloneable('lifeMin', 'lifeMax', 'random'), Sourcable('particlejs.Life', 'lifeMin', 'lifeMax', 'random'), Randomizable
    ])["in"](Life);

    function Life(lifeMin, lifeMax, random) {
      this.lifeMin = lifeMin;
      this.lifeMax = lifeMax;
      this.random = random;
      if (this.lifeMax == null) {
        this.lifeMax = this.lifeMin;
      }
      this.initRandom();
    }

    Life.prototype.initialize = function(particle) {
      if (this.lifeMin === this.lifeMax) {
        return particle.maxLife = this.lifeMin;
      } else {
        return particle.maxLife = this.random["in"](this.lifeMin, this.lifeMax);
      }
    };

    return Life;

  })();

  module.exports = Life;

}).call(this);
