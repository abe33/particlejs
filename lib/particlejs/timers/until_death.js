(function() {
  var Cloneable, Inlinable, Sourcable, UntilDeath, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  UntilDeath = (function() {

    include([
      Inlinable({
        noconstructor: true
      }), Cloneable('duration', 'particle'), Sourcable('particlejs.UntilDeath')
    ])["in"](UntilDeath);

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
