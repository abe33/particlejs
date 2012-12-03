(function() {
  var Particle, Point, Poolable, geomjs;

  geomjs = require('geomjs');

  Point = geomjs.Point;

  Poolable = require('./mixins/poolable');

  Particle = (function() {

    function Particle() {}

    Poolable.attachTo(Particle);

    Particle.prototype.init = function() {
      this.dead = false;
      this.life = 0;
      this.maxLife = 0;
      this.position = new Point;
      this.lastPosition = new Point;
      this.velocity = new Point;
      return this.parasites = {};
    };

    Particle.prototype.dispose = function() {
      this.position = null;
      this.lastPosition = null;
      this.velocity = null;
      return this.parasites = null;
    };

    Particle.prototype.die = function() {
      this.dead = true;
      return this.life = this.maxLife;
    };

    Particle.prototype.revive = function() {
      this.dead = false;
      return this.life = 0;
    };

    return Particle;

  })();

  module.exports = Particle;

}).call(this);
