(function() {
  var ParticleSubSystem, SubSystem;

  SubSystem = require('../sub_system');

  ParticleSubSystem = (function() {

    function ParticleSubSystem(initializer, action, emissionFactory, subSystem) {
      this.subSystem = new SubSystem(initializer, action, emissionFactory, subSystem);
    }

    ParticleSubSystem.prototype.initialize = function(particle) {
      return this.subSystem.emitFor(particle);
    };

    return ParticleSubSystem;

  })();

  module.exports = ParticleSubSystem;

}).call(this);
