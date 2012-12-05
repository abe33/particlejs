(function() {
  var Surface;

  Surface = (function() {

    function Surface(surface) {
      this.surface = surface;
    }

    Surface.prototype.get = function() {
      return this.surface.randomPointInSurface(this.random);
    };

    return Surface;

  })();

  module.exports = Surface;

}).call(this);
