(function() {
  var Impulse, NullAction, NullInitializer, Signal, System;

  Signal = require('../vendor/signal');

  Impulse = require('../vendor/impulse');

  NullInitializer = require('./initializers/null_initializer');

  NullAction = require('./actions/null_action');

  System = (function() {

    function System(initializer, action) {
      this.initializer = initializer != null ? initializer : new NullInitializer;
      this.action = action != null ? action : new NullAction;
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
      var particle, _i, _len, _ref, _results;
      this.action.prepare(bias, biasInSeconds, time);
      _ref = this.particles.concat();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        this.action.process(particle);
        if (particle.dead) {
          _results.push(this.unregisterParticle(particle));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
      this.died.push(particle);
      this.particles.splice(this.particles.indexOf(particle), 1);
      return particle.constructor.release(particle);
    };

    System.prototype.getTime = function() {
      return new Date().valueOf();
    };

    return System;

  })();

  module.exports = System;

}).call(this);
