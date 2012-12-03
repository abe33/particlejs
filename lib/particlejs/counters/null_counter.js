(function() {
  var NullCounter;

  NullCounter = (function() {

    function NullCounter() {}

    NullCounter.prototype.count = 0;

    NullCounter.prototype.prepare = function() {};

    return NullCounter;

  })();

  module.exports = NullCounter;

}).call(this);
