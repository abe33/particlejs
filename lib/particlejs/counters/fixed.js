(function() {
  var Fixed;

  Fixed = (function() {

    function Fixed(count) {
      this.count = count != null ? count : 1;
    }

    Fixed.prototype.prepare = function() {};

    return Fixed;

  })();

  module.exports = Fixed;

}).call(this);
