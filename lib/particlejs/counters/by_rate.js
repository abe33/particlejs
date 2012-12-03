(function() {
  var ByRate;

  ByRate = (function() {

    function ByRate(rate) {
      this.rate = rate != null ? rate : 1;
      this.count = 0;
      this.rest = 0;
    }

    ByRate.prototype.prepare = function(bias, biasInSeconds, time) {
      this.rest += biasInSeconds * this.rate;
      this.count = Math.floor(this.rest);
      return this.rest -= this.count;
    };

    return ByRate;

  })();

  module.exports = ByRate;

}).call(this);
