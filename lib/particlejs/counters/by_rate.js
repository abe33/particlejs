(function() {
  var ByRate;

  ByRate = (function() {

    function ByRate(rate) {
      this.rate = rate != null ? rate : 1;
      this.count = 0;
      this.rest = 0;
      this.offset = 1;
    }

    ByRate.prototype.prepare = function(bias, biasInSeconds, time) {
      this.rest += biasInSeconds * this.rate;
      this.count = Math.floor(this.rest);
      this.rest -= this.count;
      this.count += this.offset;
      return this.offset = 0;
    };

    return ByRate;

  })();

  module.exports = ByRate;

}).call(this);
