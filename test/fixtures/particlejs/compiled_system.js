(function(){
  var CustomSystem,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CustomSystem = (function(_super) {

    __extends(CustomSystem, _super);

    function CustomSystem(){
      CustomSystem.__super__.constructor.call(this);
      this.lifeRandom = new chancejs.Random(new chancejs.MathRandom());
      this.subSystem = (function() {
        // TODO
      })();
    };

    CustomSystem.prototype.initializeParticle = function(particle, bias){
      var biasInSeconds = bias / 1000, time = this.getTime();
      particle.maxLife = 1000;
    };

    CustomSystem.prototype.processParticles = function(bias, biasInSeconds, time){
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

  })(particlejs.System);

  return new CustomSystem;
})()
