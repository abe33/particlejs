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

    Emission.source = 'particlejs.Emission';

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
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      return "(function(){\n  var emission = {\n    init: function(){\n      " + ((_ref = this.emitter) != null ? _ref.sourceFragment('constructor') : void 0) + "\n      " + ((_ref1 = this.timer) != null ? _ref1.sourceFragment('constructor') : void 0) + "\n      " + ((_ref2 = this.counter) != null ? _ref2.sourceFragment('constructor') : void 0) + "\n      " + ((_ref3 = this.initializer) != null ? _ref3.sourceFragment('constructor') : void 0) + "\n    },\n    prepare: function(bias, biasInSeconds, time) {\n      this.iterator = 0;\n      var count = 0, nextTime = 0;\n\n      " + ((_ref4 = this.timer) != null ? _ref4.sourceFragment('prepare') : void 0) + "\n\n      " + ((_ref5 = this.counter) != null ? _ref5.sourceFragment('prepare') : void 0) + "\n\n      this._nextTime = nextTime;\n      this.count = count;\n    },\n    hasNext: function(){\n      return this.iterator < this.count;\n    },\n    next: function(){\n      var get, particle;\n      " + ((_ref6 = this.emitter) != null ? _ref6.sourceFragment('get') : void 0) + "\n\n      particle = particlejs.Particle.get({position: get});\n      particle.position.x = get.x;\n      particle.position.y = get.y;\n\n      " + ((_ref7 = this.initializer) != null ? _ref7.sourceFragment('initialize') : void 0) + "\n\n      this.iterator++;\n      return particle;\n    },\n    nextTime: function(){\n      return this._nextTime;\n    },\n    finished: function(){\n      var finished = true;\n\n      " + ((_ref8 = this.timer) != null ? _ref8.sourceFragment('finished') : void 0) + "\n\n      return finished;\n    }\n  };\n  emission.init();\n  return emission;\n})()";
    };

    Emission.prototype.toSource = function() {
      var args;
      args = this.getArgumentsSource();
      return "new " + this.constructor.source + "(" + (args.join(',')) + ")";
    };

    Emission.prototype.getArgumentsSource = function() {
      var args,
        _this = this;
      args = [this.particleType.source];
      ['emitter', 'timer', 'counter', 'initializer'].forEach(function(p) {
        return args.push(_this[p].toSource());
      });
      return args;
    };

    return Emission;

  })();

  module.exports = Emission;

}).call(this);
