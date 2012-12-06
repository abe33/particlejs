(function() {
  var Life, Randomizable;

  Randomizable = require('../mixins/randomizable');

  Life = (function() {

    Randomizable.attachTo(Life);

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
