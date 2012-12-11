(function() {
  var Cloneable, Emission, NullCounter, NullEmitter, NullTimer, PROPERTIES, Particle, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Particle = require('./particle');

  NullTimer = require('./timers/null_timer');

  NullCounter = require('./counters/null_counter');

  NullEmitter = require('./emitters/null_emitter');

  PROPERTIES = ['particleType', 'emitter', 'timer', 'counter', 'initializer'];

  Emission = (function() {

    include([Cloneable.apply(null, PROPERTIES)])["in"](Emission);

    function Emission(particleType, emitter, timer, counter, initializer) {
      this.particleType = particleType != null ? particleType : Particle;
      this.emitter = emitter != null ? emitter : new NullEmitter();
      this.timer = timer != null ? timer : new NullTimer();
      this.counter = counter != null ? counter : new NullCounter();
      this.initializer = initializer != null ? initializer : null;
    }

    Emission.prototype.prepare = function(bias, biasInSeconds, time) {
      var nextTime;
      this.timer.prepare(bias, biasInSeconds, time);
      nextTime = this.timer.nextTime;
      this.counter.prepare(nextTime, nextTime / 1000, time);
      this.currentCount = this.counter.count;
      this.currentTime = nextTime;
      return this.iterator = 0;
    };

    Emission.prototype.hasNext = function() {
      return this.iterator < this.currentCount;
    };

    Emission.prototype.next = function() {
      var particle, _ref;
      particle = this.particleType.get({
        position: this.emitter.get()
      });
      if ((_ref = this.initializer) != null) {
        _ref.initialize(particle);
      }
      this.iterator++;
      return particle;
    };

    Emission.prototype.nextTime = function() {
      return this.currentTime - this.iterator / this.currentCount * this.currentTime;
    };

    Emission.prototype.finished = function() {
      return this.timer.finished();
    };

    Emission.prototype.compile = function() {
      return '';
    };

    Emission.prototype.toSource = function() {
      var args,
        _this = this;
      args = [this.particleType.source];
      ['emitter', 'timer', 'counter', 'initializer'].forEach(function(p) {
        return args.push(_this[p].toSource());
      });
      return "new particlejs.Emission(" + (args.join(',')) + ")";
    };

    return Emission;

  })();

  module.exports = Emission;

}).call(this);
