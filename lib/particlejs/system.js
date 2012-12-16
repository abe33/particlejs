(function() {
  var Cloneable, Impulse, NullAction, NullInitializer, Signal, Sourcable, System, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Signal = require('../vendor/signal');

  Impulse = require('../vendor/impulse');

  NullInitializer = require('./initializers/null_initializer');

  NullAction = require('./actions/null_action');

  System = (function() {

    System.source = 'particlejs.System';

    include([Cloneable('initializer', 'action', 'subSystem')])["in"](System);

    function System(initializer, action, subSystem) {
      this.initializer = initializer != null ? initializer : new NullInitializer;
      this.action = action != null ? action : new NullAction;
      this.subSystem = subSystem;
      this.particlesCreated = new Signal;
      this.particlesDied = new Signal;
      this.emissionStarted = new Signal;
      this.emissionFinished = new Signal;
      this.particles = [];
      this.emissions = [];
    }

    System.prototype.emit = function(emission) {
      this.emissions.push(emission);
      emission.system = this;
      return this.startEmission(emission);
    };

    System.prototype.startEmission = function(emission) {
      emission.prepare(0, 0, this.getTime());
      this.created = [];
      this.died = [];
      if (!this.running) {
        this.start();
      }
      this.processEmission(emission);
      this.emissionStarted.dispatch(this, emission);
      if (this.created.length > 0) {
        this.particlesCreated.dispatch(this, this.created);
      }
      if (this.died.length > 0) {
        this.particlesDied.dispatch(this, this.died);
      }
      this.died = null;
      return this.created = null;
    };

    System.prototype.start = function() {
      if (!this.running) {
        Impulse.instance().add(this.tick, this);
        return this.running = true;
      }
    };

    System.prototype.stop = function() {
      if (this.running) {
        Impulse.instance().remove(this.tick, this);
        return this.running = false;
      }
    };

    System.prototype.tick = function(bias, biasInSeconds, time) {
      this.died = [];
      this.created = [];
      this.processParticles(bias, biasInSeconds, time);
      if (this.emitting()) {
        this.processEmissions(bias, biasInSeconds, time);
      }
      if (this.created.length > 0) {
        this.particlesCreated.dispatch(this, this.created);
      }
      if (this.died.length > 0) {
        this.particlesDied.dispatch(this, this.died);
      }
      this.died = null;
      return this.created = null;
    };

    System.prototype.emitting = function() {
      return this.emissions.length > 0;
    };

    System.prototype.processEmissions = function(bias, biasInSeconds, time) {
      var emission, _i, _len, _ref, _results;
      _ref = this.emissions.concat();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        emission = _ref[_i];
        emission.prepare(bias, biasInSeconds, time);
        _results.push(this.processEmission(emission));
      }
      return _results;
    };

    System.prototype.processEmission = function(emission) {
      var particle, time, _results;
      _results = [];
      while (emission.hasNext()) {
        time = emission.nextTime();
        particle = emission.next();
        this.created.push(particle);
        this.registerParticle(particle);
        this.initializeParticle(particle, time);
        if (emission.finished()) {
          this.removeEmission(emission);
          _results.push(this.emissionFinished.dispatch(this, emission));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    System.prototype.removeEmission = function(emission) {
      return this.emissions.splice(this.emissions.indexOf(emission), 1);
    };

    System.prototype.processParticles = function(bias, biasInSeconds, time) {
      var particle, _i, _len, _ref;
      this.action.prepare(bias, biasInSeconds, time);
      _ref = this.particles.concat();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        this.action.process(particle);
        if (particle.dead) {
          this.unregisterParticle(particle);
        }
      }
    };

    System.prototype.initializeParticle = function(particle, time) {
      this.initializer.initialize(particle);
      this.action.prepare(time, time / 1000, this.getTime());
      this.action.process(particle);
      if (particle.dead) {
        return this.unregisterParticle(particle);
      }
    };

    System.prototype.registerParticle = function(particle) {
      return this.particles.push(particle);
    };

    System.prototype.unregisterParticle = function(particle) {
      var _ref;
      this.died.push(particle);
      if ((_ref = this.subSystem) != null) {
        _ref.emitFor(particle);
      }
      this.particles.splice(this.particles.indexOf(particle), 1);
      return particle.constructor.release(particle);
    };

    System.prototype.getTime = function() {
      return new Date().valueOf();
    };

    System.prototype.compile = function() {
      return "(function(){\nvar CustomSystem,\n  __hasProp = {}.hasOwnProperty,\n  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n\nCustomSystem = (function(_super) {\n\n  __extends(CustomSystem, _super);\n\n  function CustomSystem(){\n    CustomSystem.__super__.constructor.call(this);\n    " + (this.initializer.sourceFragment('constructor')) + "\n    " + (this.action.sourceFragment('constructor')) + "\n    this.subSystem = (function() {\n      // TODO\n    })();\n  };\n\n  CustomSystem.prototype.initializeParticle = function(particle, bias){\n    var biasInSeconds = bias / 1000, time = this.getTime();\n    " + (this.initializer.sourceFragment('initialize')) + "\n  };\n\n  CustomSystem.prototype.processParticles = function(bias, biasInSeconds, time){\n    var particle, _i, _len, _ref;\n    " + (this.action.sourceFragment('prepare')) + "\n\n    _ref = this.particles.concat();\n    for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n      particle = _ref[_i];\n      " + (this.action.sourceFragment('process')) + "\n      if (particle.dead) {\n        this.unregisterParticle(particle)\n      }\n    }\n  };\n\n})(particlejs.System);\n\nreturn new CustomSystem;\n})()";
    };

    System.prototype.toSource = function() {
      var args;
      args = this.getArgumentsSource();
      return "new " + this.constructor.source + "(" + (args.join(',')) + ")";
    };

    System.prototype.getArgumentsSource = function() {
      var _this = this;
      return ['initializer', 'action', 'subSystem'].select(function(p) {
        return _this[p] != null;
      }).map(function(p) {
        return _this[p].toSource();
      });
    };

    return System;

  })();

  module.exports = System;

}).call(this);
