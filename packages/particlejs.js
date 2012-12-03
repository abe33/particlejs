(function() {
  var BaseAction, ByRate, Emission, Impulse, Life, Limited, Live, Mixin, NullAction, NullCounter, NullEmitter, NullInitializer, NullTimer, Particle, Point, Ponctual, Poolable, Signal, System, requestAnimationFrame,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.particlejs || (this.particlejs = {});

  /* src/vendor/signal.coffee */;


  /* src/vendor/signal.coffee<Signal> line:1 */;


  Signal = (function() {
    /* src/vendor/signal.coffee<Signal::constructor> line:2 */;

    function Signal() {
      this.listeners = [];
    }

    /* src/vendor/signal.coffee<Signal::add> line:5 */;


    Signal.prototype.add = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      if (!this.registered(listener, context)) {
        this.listeners.push([listener, context, false, priority]);
        return this.sortListeners();
      }
    };

    /* src/vendor/signal.coffee<Signal::addOnce> line:10 */;


    Signal.prototype.addOnce = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      if (!this.registered(listener, context)) {
        this.listeners.push([listener, context, true, priority]);
        return this.sortListeners();
      }
    };

    /* src/vendor/signal.coffee<Signal::remove> line:15 */;


    Signal.prototype.remove = function(listener, context) {
      if (this.registered(listener, context)) {
        return this.listeners.splice(this.indexOf(listener, context), 1);
      }
    };

    /* src/vendor/signal.coffee<Signal::removeAll> line:19 */;


    Signal.prototype.removeAll = function() {
      return this.listeners = [];
    };

    /* src/vendor/signal.coffee<Signal::indexOf> line:22 */;


    Signal.prototype.indexOf = function(listener, context) {
      var c, i, l, _i, _len, _ref, _ref1;
      _ref = this.listeners;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        _ref1 = _ref[i], l = _ref1[0], c = _ref1[1];
        if (listener === l && context === c) {
          return i;
        }
      }
      return -1;
    };

    /* src/vendor/signal.coffee<Signal::registered> line:26 */;


    Signal.prototype.registered = function(listener, context) {
      return this.indexOf(listener, context) !== -1;
    };

    /* src/vendor/signal.coffee<Signal::sortListeners> line:29 */;


    Signal.prototype.sortListeners = function() {
      if (this.listeners.length <= 1) {
        return;
      }
      return this.listeners.sort(function(a, b) {
        var pA, pB, _ref;
        _ref = [a[3], b[3]], pA = _ref[0], pB = _ref[1];
        if (pA < pB) {
          return 1;
        } else if (pB < pA) {
          return -1;
        } else {
          return 0;
        }
      });
    };

    /* src/vendor/signal.coffee<Signal::dispatch> line:36 */;


    Signal.prototype.dispatch = function() {
      var context, listener, listeners, once, priority, _i, _len, _ref, _results;
      listeners = this.listeners.concat();
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        _ref = listeners[_i], listener = _ref[0], context = _ref[1], once = _ref[2], priority = _ref[3];
        listener.apply(context, arguments);
        if (once) {
          _results.push(this.remove(listener, context));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Signal;

  })();

  /* src/vendor/impulse.coffee */;


  requestAnimationFrame = (typeof window !== "undefined" && window !== null ? window.requestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.webkitRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.mozRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.oRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.msRequestAnimationFrame : void 0) || function() {
    return setTimeout(callback, 1000 / 60);
  };

  /* src/vendor/impulse.coffee<Impulse> line:9 */;


  Impulse = (function(_super) {

    __extends(Impulse, _super);

    /* src/vendor/impulse.coffee<Impulse.instance> line:10 */;


    Impulse.instance = function() {
      return this._instance || (this._instance = new Impulse);
    };

    /* src/vendor/impulse.coffee<Impulse::constructor> line:12 */;


    function Impulse(timeScale) {
      this.timeScale = timeScale != null ? timeScale : 1;
      Impulse.__super__.constructor.call(this);
      this.running = false;
    }

    /* src/vendor/impulse.coffee<Impulse::add> line:16 */;


    Impulse.prototype.add = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.add.call(this, listener, context, priority);
      if (this.hasListeners() && !this.running) {
        return this.start();
      }
    };

    /* src/vendor/impulse.coffee<Impulse::remove> line:20 */;


    Impulse.prototype.remove = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.remove.call(this, listener, context, priority);
      if (this.running && !this.hasListeners()) {
        return this.stop();
      }
    };

    /* src/vendor/impulse.coffee<Impulse::hasListeners> line:24 */;


    Impulse.prototype.hasListeners = function() {
      return this.listeners.length > 0;
    };

    /* src/vendor/impulse.coffee<Impulse::start> line:27 */;


    Impulse.prototype.start = function() {
      this.running = true;
      return this.initRun();
    };

    /* src/vendor/impulse.coffee<Impulse::stop> line:31 */;


    Impulse.prototype.stop = function() {
      return this.running = false;
    };

    /* src/vendor/impulse.coffee<Impulse::initRun> line:33 */;


    Impulse.prototype.initRun = function() {
      var _this = this;
      this.time = this.getTime();
      return requestAnimationFrame(function() {
        return _this.run();
      });
    };

    /* src/vendor/impulse.coffee<Impulse::run> line:37 */;


    Impulse.prototype.run = function() {
      var s, t;
      if (this.running) {
        t = this.getTime();
        s = (t - this.time) * this.timeScale;
        this.dispatch(s, s / 1000, t);
        return this.initRun();
      }
    };

    /* src/vendor/impulse.coffee<Impulse::getTime> line:45 */;


    Impulse.prototype.getTime = function() {
      return new Date().getTime();
    };

    return Impulse;

  })(Signal);

  /* src/particlejs/actions/base_action.coffee */;


  /* src/particlejs/actions/base_action.coffee<BaseAction> line:2 */;


  BaseAction = (function() {

    function BaseAction() {}

    /* src/particlejs/actions/base_action.coffee<BaseAction::prepare> line:3 */;


    BaseAction.prototype.prepare = function(bias, biasInSeconds, time) {
      this.bias = bias;
      this.biasInSeconds = biasInSeconds;
      this.time = time;
    };

    return BaseAction;

  })();

  /* src/particlejs/actions/live.coffee */;


  /* src/particlejs/actions/live.coffee<Live> line:3 */;


  Live = (function(_super) {

    __extends(Live, _super);

    function Live() {
      return Live.__super__.constructor.apply(this, arguments);
    }

    /* src/particlejs/actions/live.coffee<Live::process> line:4 */;


    Live.prototype.process = function(particle) {
      particle.life += this.bias;
      if (particle.life >= particle.maxLife) {
        return particle.die();
      }
    };

    return Live;

  })(BaseAction);

  /* src/particlejs/actions/null_action.coffee */;


  /* src/particlejs/actions/null_action.coffee<NullAction> line:2 */;


  NullAction = (function() {

    function NullAction() {}

    /* src/particlejs/actions/null_action.coffee<NullAction::prepare> line:3 */;


    NullAction.prototype.prepare = function() {};

    /* src/particlejs/actions/null_action.coffee<NullAction::process> line:4 */;


    NullAction.prototype.process = function() {};

    return NullAction;

  })();

  /* src/particlejs/counters/by_rate.coffee */;


  /* src/particlejs/counters/by_rate.coffee<ByRate> line:2 */;


  ByRate = (function() {
    /* src/particlejs/counters/by_rate.coffee<ByRate::constructor> line:3 */;

    function ByRate(rate) {
      this.rate = rate != null ? rate : 1;
      this.count = 0;
      this.rest = 0;
    }

    /* src/particlejs/counters/by_rate.coffee<ByRate::prepare> line:7 */;


    ByRate.prototype.prepare = function(bias, biasInSeconds, time) {
      this.rest += biasInSeconds * this.rate;
      this.count = Math.floor(this.rest);
      return this.rest -= this.count;
    };

    return ByRate;

  })();

  /* src/particlejs/counters/null_counter.coffee */;


  /* src/particlejs/counters/null_counter.coffee<NullCounter> line:2 */;


  NullCounter = (function() {

    function NullCounter() {}

    NullCounter.prototype.count = 0;

    /* src/particlejs/counters/null_counter.coffee<NullCounter::prepare> line:4 */;


    NullCounter.prototype.prepare = function() {};

    return NullCounter;

  })();

  /* src/particlejs/emission.coffee */;


  /* src/particlejs/emission.coffee<Emission> line:3 */;


  Emission = (function() {

    function Emission(particleType, emitter, timer, counter, initializer) {
      this.particleType = particleType != null ? particleType : Particle;
      this.emitter = emitter != null ? emitter : new NullEmitter();
      this.timer = timer != null ? timer : new NullTimer();
      this.counter = counter != null ? counter : new NullCounter();
      this.initializer = initializer != null ? initializer : null;
    }

    /* src/particlejs/emission.coffee<Emission::prepare> line:10 */;


    Emission.prototype.prepare = function(bias, biasInSeconds, time) {
      var nextTime;
      this.timer.prepare(bias, biasInSeconds, time);
      nextTime = this.timer.nextTime;
      this.counter.prepare(nextTime, nextTime / 1000, time);
      this.currentCount = this.counter.count;
      this.currentTime = nextTime;
      return this.iterator = 0;
    };

    /* src/particlejs/emission.coffee<Emission::hasNext> line:20 */;


    Emission.prototype.hasNext = function() {
      return this.iterator < this.currentCount;
    };

    /* src/particlejs/emission.coffee<Emission::next> line:21 */;


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

    /* src/particlejs/emission.coffee<Emission::nextTime> line:28 */;


    Emission.prototype.nextTime = function() {
      return this.currentTime - this.iterator / this.currentCount * this.currentTime;
    };

    /* src/particlejs/emission.coffee<Emission::finished> line:30 */;


    Emission.prototype.finished = function() {
      return this.timer.finished();
    };

    return Emission;

  })();

  /* src/particlejs/emitters/null_emitter.coffee */;


  Point = geomjs.Point;

  /* src/particlejs/emitters/null_emitter.coffee<NullEmitter> line:4 */;


  NullEmitter = (function() {

    function NullEmitter() {}

    /* src/particlejs/emitters/null_emitter.coffee<NullEmitter::get> line:5 */;


    NullEmitter.prototype.get = function() {
      return new Point;
    };

    return NullEmitter;

  })();

  /* src/particlejs/emitters/ponctual.coffee */;


  Point = geomjs.Point;

  /* src/particlejs/emitters/ponctual.coffee<Ponctual> line:4 */;


  Ponctual = (function() {
    /* src/particlejs/emitters/ponctual.coffee<Ponctual::constructor> line:5 */;

    function Ponctual(point) {
      this.point = point != null ? point : new Point;
    }

    /* src/particlejs/emitters/ponctual.coffee<Ponctual::get> line:6 */;


    Ponctual.prototype.get = function() {
      return this.point.clone();
    };

    return Ponctual;

  })();

  /* src/particlejs/initializers/life.coffee */;


  /* src/particlejs/initializers/life.coffee<Life> line:2 */;


  Life = (function() {
    /* src/particlejs/initializers/life.coffee<Life::constructor> line:3 */;

    function Life(life) {
      this.life = life;
    }

    /* src/particlejs/initializers/life.coffee<Life::initialize> line:5 */;


    Life.prototype.initialize = function(particle) {
      return particle.maxLife = this.life;
    };

    return Life;

  })();

  /* src/particlejs/initializers/null_initializer.coffee */;


  /* src/particlejs/initializers/null_initializer.coffee<NullInitializer> line:2 */;


  NullInitializer = (function() {

    function NullInitializer() {}

    /* src/particlejs/initializers/null_initializer.coffee<NullInitializer::initialize> line:3 */;


    NullInitializer.prototype.initialize = function() {};

    return NullInitializer;

  })();

  /* src/particlejs/mixins/poolable.coffee */;


  Mixin = geomjs.Mixin;

  /* src/particlejs/mixins/poolable.coffee<Poolable> line:4 */;


  Poolable = (function(_super) {

    __extends(Poolable, _super);

    function Poolable() {
      return Poolable.__super__.constructor.apply(this, arguments);
    }

    /* src/particlejs/mixins/poolable.coffee<Poolable.included> line:5 */;


    Poolable.included = function(klass) {
      klass.resetPools = function() {
        this.allocated = [];
        return this.pooled = [];
      };
      klass.get = function(defaults) {
        var instance, k, v;
        if (defaults == null) {
          defaults = {};
        }
        if (this.pooled.length > 0) {
          instance = this.pooled.shift();
        } else {
          instance = new klass;
        }
        if (typeof instance.init === "function") {
          instance.init();
        }
        for (k in defaults) {
          v = defaults[k];
          instance[k] = v;
        }
        this.allocated.push(instance);
        return instance;
      };
      klass.release = function(instance) {
        var index;
        index = this.allocated.indexOf(instance);
        instance.dispose();
        this.allocated.splice(index, 1);
        return this.pooled.push(instance);
      };
      return klass.resetPools();
    };

    return Poolable;

  })(Mixin);

  /* src/particlejs/particle.coffee */;


  Point = geomjs.Point;

  /* src/particlejs/particle.coffee<Particle> line:4 */;


  Particle = (function() {

    function Particle() {}

    Poolable.attachTo(Particle);

    /* src/particlejs/particle.coffee<Particle::init> line:7 */;


    Particle.prototype.init = function() {
      this.dead = false;
      this.life = 0;
      this.maxLife = 0;
      this.position = new Point;
      this.lastPosition = new Point;
      this.velocity = new Point;
      return this.parasites = {};
    };

    /* src/particlejs/particle.coffee<Particle::dispose> line:16 */;


    Particle.prototype.dispose = function() {
      this.position = null;
      this.lastPosition = null;
      this.velocity = null;
      return this.parasites = null;
    };

    /* src/particlejs/particle.coffee<Particle::die> line:22 */;


    Particle.prototype.die = function() {
      this.dead = true;
      return this.life = this.maxLife;
    };

    /* src/particlejs/particle.coffee<Particle::revive> line:26 */;


    Particle.prototype.revive = function() {
      this.dead = false;
      return this.life = 0;
    };

    return Particle;

  })();

  /* src/particlejs/system.coffee */;


  /* src/particlejs/system.coffee<System> line:2 */;


  System = (function() {
    /* src/particlejs/system.coffee<System::constructor> line:3 */;

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

    /* src/particlejs/system.coffee<System::emit> line:11 */;


    System.prototype.emit = function(emission) {
      this.emissions.push(emission);
      emission.system = this;
      return this.startEmission(emission);
    };

    /* src/particlejs/system.coffee<System::startEmission> line:16 */;


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

    /* src/particlejs/system.coffee<System::start> line:31 */;


    System.prototype.start = function() {
      if (!this.running) {
        Impulse.instance().add(this.tick, this);
        return this.running = true;
      }
    };

    /* src/particlejs/system.coffee<System::stop> line:36 */;


    System.prototype.stop = function() {
      if (this.running) {
        Impulse.instance().remove(this.tick, this);
        return this.running = false;
      }
    };

    /* src/particlejs/system.coffee<System::tick> line:41 */;


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

    /* src/particlejs/system.coffee<System::emitting> line:54 */;


    System.prototype.emitting = function() {
      return this.emissions.length > 0;
    };

    /* src/particlejs/system.coffee<System::processEmissions> line:56 */;


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

    /* src/particlejs/system.coffee<System::processEmission> line:61 */;


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

    /* src/particlejs/system.coffee<System::removeEmission> line:72 */;


    System.prototype.removeEmission = function(emission) {
      return this.emissions.splice(this.emissions.indexOf(emission), 1);
    };

    /* src/particlejs/system.coffee<System::processParticles> line:75 */;


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

    /* src/particlejs/system.coffee<System::initializeParticle> line:81 */;


    System.prototype.initializeParticle = function(particle, time) {
      this.initializer.initialize(particle);
      this.action.prepare(time, time / 1000, this.getTime());
      this.action.process(particle);
      if (particle.dead) {
        return this.unregisterParticle(particle);
      }
    };

    /* src/particlejs/system.coffee<System::registerParticle> line:88 */;


    System.prototype.registerParticle = function(particle) {
      return this.particles.push(particle);
    };

    /* src/particlejs/system.coffee<System::unregisterParticle> line:91 */;


    System.prototype.unregisterParticle = function(particle) {
      this.died.push(particle);
      return this.particles.splice(this.particles.indexOf(particle), 1);
    };

    /* src/particlejs/system.coffee<System::getTime> line:95 */;


    System.prototype.getTime = function() {
      return new Date().valueOf();
    };

    return System;

  })();

  /* src/particlejs/timers/limited.coffee */;


  /* src/particlejs/timers/limited.coffee<Limited> line:2 */;


  Limited = (function() {
    /* src/particlejs/timers/limited.coffee<Limited::constructor> line:3 */;

    function Limited(duration, since) {
      this.duration = duration != null ? duration : 1000;
      this.since = since != null ? since : 0;
      this.time = 0;
      this.nextTime = 0;
    }

    /* src/particlejs/timers/limited.coffee<Limited::prepare> line:7 */;


    Limited.prototype.prepare = function(bias, biasInSeconds, time) {
      if (!this.firstTime) {
        this.nextTime = this.since + bias;
        this.firstTime = true;
      } else {
        this.nextTime = bias;
      }
      return this.time += bias;
    };

    /* src/particlejs/timers/limited.coffee<Limited::finished> line:15 */;


    Limited.prototype.finished = function() {
      return this.time >= this.duration;
    };

    return Limited;

  })();

  /* src/particlejs/timers/null_timer.coffee */;


  /* src/particlejs/timers/null_timer.coffee<NullTimer> line:2 */;


  NullTimer = (function() {

    function NullTimer() {}

    NullTimer.prototype.nextTime = 0;

    /* src/particlejs/timers/null_timer.coffee<NullTimer::prepare> line:4 */;


    NullTimer.prototype.prepare = function() {};

    /* src/particlejs/timers/null_timer.coffee<NullTimer::finished> line:5 */;


    NullTimer.prototype.finished = function() {
      return true;
    };

    return NullTimer;

  })();

  this.particlejs.Signal = Signal;

  this.particlejs.Impulse = Impulse;

  this.particlejs.BaseAction = BaseAction;

  this.particlejs.Live = Live;

  this.particlejs.NullAction = NullAction;

  this.particlejs.ByRate = ByRate;

  this.particlejs.NullCounter = NullCounter;

  this.particlejs.Emission = Emission;

  this.particlejs.NullEmitter = NullEmitter;

  this.particlejs.Ponctual = Ponctual;

  this.particlejs.Life = Life;

  this.particlejs.NullInitializer = NullInitializer;

  this.particlejs.Poolable = Poolable;

  this.particlejs.Particle = Particle;

  this.particlejs.System = System;

  this.particlejs.Limited = Limited;

  this.particlejs.NullTimer = NullTimer;

}).call(this);
