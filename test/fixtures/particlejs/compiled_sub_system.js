(function(){
  var CustomSubSystem,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CustomSubSystem = (function(_super) {

    __extends(CustomSubSystem, _super);

    function CustomSubSystem(){
      CustomSubSystem.__super__.constructor.call(this);
      this.lifeRandom = new chancejs.Random(new chancejs.MathRandom());
      this.emissionFactory = function (particle) {
        return new Emission(Particle, new Ponctual(particle.position.clone()), new Limited(1000, 100), new ByRate(10));
      };
    };

    CustomSubSystem.prototype.initializeParticle = function(particle, bias){
      var biasInSeconds = bias / 1000, time = this.getTime();
      particle.maxLife = 1000;
    };

    CustomSubSystem.prototype.processParticles = function(bias, biasInSeconds, time){
      var particle, _i, _len, _ref;

      _ref = this.particles.concat();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        particle.life += bias;
        if (particle.life >= particle.maxLife) {
          particle.die();
        }
        if (particle.dead) {
          this.unregisterParticle(particle)
        }
      }
    };

  })(particlejs.SubSystem);

  return new CustomSubSystem;
})()
