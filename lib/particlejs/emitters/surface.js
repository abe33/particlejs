(function() {
  var Randomizable, Surface;

  Randomizable = require('../mixins/randomizable');

  Surface = (function() {

    Randomizable.attachTo(Surface);

    function Surface(surface, random) {
      this.surface = surface;
      this.random = random;
      this.initRandom();
    }

    Surface.prototype.get = function() {
      return this.surface.randomPointInSurface(this.random);
    };

    return Surface;

  })();

  module.exports = Surface;

}).call(this);
