(function() {
  var Life;

  Life = (function() {

    function Life(life) {
      this.life = life;
    }

    Life.prototype.initialize = function(particle) {
      return particle.maxLife = this.life;
    };

    return Life;

  })();

  module.exports = Life;

}).call(this);
