(function() {
  var ARGUMENTS, Cloneable, Inlinable, PROPERTIES, Point, Randomizable, Sourcable, Stream, geomjs, include, mixinsjs;

  geomjs = require('geomjs');

  mixinsjs = require('mixinsjs');

  Point = geomjs.Point;

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Randomizable = require('../mixins/randomizable');

  PROPERTIES = ['velocityMin', 'velocityMax', 'angleRandom'];

  ARGUMENTS = ['direction'].concat(PROPERTIES).concat('random');

  Stream = (function() {

    include([
      Inlinable({
        inlinedProperties: PROPERTIES,
        rename: {
          random: 'streamRandom'
        },
        mapSource: {
          constructor: 'this.direction = @direction;\nthis.random = @random;'
        }
      }), Cloneable.apply(null, ARGUMENTS), Sourcable.apply(null, ['particlejs.Stream'].concat(ARGUMENTS)), Randomizable
    ])["in"](Stream);

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
