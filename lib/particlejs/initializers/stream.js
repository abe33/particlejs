(function() {
  var Point, Randomizable, Stream, geomjs;

  geomjs = require('geomjs');

  Randomizable = require('../mixins/randomizable');

  Point = geomjs.Point;

  Stream = (function() {

    Randomizable.attachTo(Stream);

    function Stream(direction, velocityMin, velocityMax, angleRandom, random) {
      this.direction = direction != null ? direction : new Point(1, 1);
      this.velocityMin = velocityMin != null ? velocityMin : 0;
      this.velocityMax = velocityMax != null ? velocityMax : 1;
      this.angleRandom = angleRandom != null ? angleRandom : 0;
      this.random = random;
      this.initRandom();
    }

    Stream.prototype.initialize = function(particle) {
      var angle, velocity;
      velocity = this.random["in"](this.velocityMin, this.velocityMax);
      angle = this.direction.angle();
      if (this.angleRandom !== 0) {
        angle += this.random.pad(this.angleRandom);
      }
      particle.velocity.x = Math.cos(angle) * velocity;
      return particle.velocity.y = Math.sin(angle) * velocity;
    };

    return Stream;

  })();

  module.exports = Stream;

}).call(this);
