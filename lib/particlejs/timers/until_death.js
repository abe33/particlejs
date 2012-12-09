(function() {
  var UntilDeath;

  UntilDeath = (function() {

    function UntilDeath(particle) {
      this.particle = particle;
    }

    UntilDeath.prototype.prepare = function(bias, biasInSeconds, time) {
      return this.nextTime = bias;
    };

    UntilDeath.prototype.finished = function() {
      return this.particle.dead;
    };

    return UntilDeath;

  })();

  module.exports = UntilDeath;

}).call(this);
