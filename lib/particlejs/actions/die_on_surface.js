(function() {
  var DieOnSurface;

  DieOnSurface = (function() {

    function DieOnSurface(surfaces) {
      this.surfaces = surfaces;
      if (Object.prototype.toString.call(this.surface).indexOf('Array') === -1) {
        this.surfaces = [this.surfaces];
      }
    }

    DieOnSurface.prototype.prepare = function() {};

    DieOnSurface.prototype.process = function(p) {
      var surface, _i, _len, _ref;
      _ref = this.surfaces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        surface = _ref[_i];
        if (surface.contains(p.position)) {
          return p.die();
        }
      }
    };

    return DieOnSurface;

  })();

  module.exports = DieOnSurface;

}).call(this);
