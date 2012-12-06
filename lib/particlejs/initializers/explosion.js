(function() {
  var Explosion, Randomizable;

  Randomizable = require('../mixins/randomizable');

  Explosion = (function() {

    Randomizable.attachTo(Explosion);

    function Explosion(velocityMin, velocityMax, angleMin, angleMax, random) {
      this.velocityMin = velocityMin != null ? velocityMin : 0;
      this.velocityMax = velocityMax != null ? velocityMax : 1;
      this.angleMin = angleMin != null ? angleMin : 0;
      this.angleMax = angleMax != null ? angleMax : Math.PI * 2;
      this.random = random;
      this.initRandom();
    }

    Explosion.prototype.initialize = function(particle) {
      var angle, velocity;
      angle = this.random["in"](this.angleMin, this.angleMax);
      velocity = this.random["in"](this.velocityMin, this.velocityMax);
      particle.velocity.x = Math.cos(angle) * velocity;
      return particle.velocity.y = Math.sin(angle) * velocity;
    };

    return Explosion;

  })();

  module.exports = Explosion;

}).call(this);
