(function() {
  var Instant;

  Instant = (function() {

    function Instant() {}

    Instant.prototype.prepare = function() {};

    Instant.prototype.finished = function() {
      return true;
    };

    Instant.prototype.nextTime = function() {
      return 0;
    };

    return Instant;

  })();

  module.exports = Instant;

}).call(this);
