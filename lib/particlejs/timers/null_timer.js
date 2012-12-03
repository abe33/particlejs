(function() {
  var NullTimer;

  NullTimer = (function() {

    function NullTimer() {}

    NullTimer.prototype.nextTime = 0;

    NullTimer.prototype.prepare = function() {};

    NullTimer.prototype.finished = function() {
      return true;
    };

    return NullTimer;

  })();

  module.exports = NullTimer;

}).call(this);
