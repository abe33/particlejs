(function() {
  var BaseAction, ByRate, DEFAULT_RANDOM, Emission, Explosion, Fixed, Force, Friction, Impulse, Instant, Life, Limited, Live, MacroAction, MacroInitializer, MathRandom, Mixin, Move, NullAction, NullCounter, NullEmitter, NullInitializer, NullTimer, Particle, ParticleSubSystem, Path, Point, Ponctual, Poolable, Random, Randomizable, Signal, Stream, SubSystem, Surface, System, Unlimited, UntilDeath, requestAnimationFrame,
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


  requestAnimationFrame = (typeof window !== "undefined" && window !== null ? window.requestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.webkitRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.mozRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.oRequestAnimationFrame : void 0) || (typeof window !== "undefined" && window !== null ? window.msRequestAnimationFrame : void 0) || function(callback) {
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
      var s, t, _ref, _ref1;
      if (this.running) {
        if ((_ref = this.stats) != null) {
          _ref.begin();
        }
        t = this.getTime();
        s = (t - this.time) * this.timeScale;
        this.dispatch(s, s / 1000, t);
        this.initRun();
        return (_ref1 = this.stats) != null ? _ref1.end() : void 0;
      }
    };

    /* src/vendor/impulse.coffee<Impulse::getTime> line:47 */;


    Impulse.prototype.getTime = function() {
      return new Date().getTime();
    };

    return Impulse;

  })(Signal);

  /* src/particlejs/system.coffee */;


  /* src/particlejs/system.coffee<System> line:2 */;


  System = (function() {

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

    /* src/particlejs/system.coffee<System::emit> line:12 */;


    System.prototype.emit = function(emission) {
      this.emissions.push(emission);
      emission.system = this;
      return this.startEmission(emission);
    };

    /* src/particlejs/system.coffee<System::startEmission> line:17 */;


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

    /* src/particlejs/system.coffee<System::start> line:32 */;


    System.prototype.start = function() {
      if (!this.running) {
        Impulse.instance().add(this.tick, this);
        return this.running = true;
      }
    };

    /* src/particlejs/system.coffee<System::stop> line:37 */;


    System.prototype.stop = function() {
      if (this.running) {
        Impulse.instance().remove(this.tick, this);
        return this.running = false;
      }
    };

    /* src/particlejs/system.coffee<System::tick> line:42 */;


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

    /* src/particlejs/system.coffee<System::emitting> line:55 */;


    System.prototype.emitting = function() {
      return this.emissions.length > 0;
    };

    /* src/particlejs/system.coffee<System::processEmissions> line:57 */;


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

    /* src/particlejs/system.coffee<System::processEmission> line:62 */;


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

    /* src/particlejs/system.coffee<System::removeEmission> line:73 */;


    System.prototype.removeEmission = function(emission) {
      return this.emissions.splice(this.emissions.indexOf(emission), 1);
    };

    /* src/particlejs/system.coffee<System::processParticles> line:76 */;


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

    /* src/particlejs/system.coffee<System::initializeParticle> line:82 */;


    System.prototype.initializeParticle = function(particle, time) {
      this.initializer.initialize(particle);
      this.action.prepare(time, time / 1000, this.getTime());
      this.action.process(particle);
      if (particle.dead) {
        return this.unregisterParticle(particle);
      }
    };

    /* src/particlejs/system.coffee<System::registerParticle> line:89 */;


    System.prototype.registerParticle = function(particle) {
      return this.particles.push(particle);
    };

    /* src/particlejs/system.coffee<System::unregisterParticle> line:92 */;


    System.prototype.unregisterParticle = function(particle) {
      var _ref;
      this.died.push(particle);
      if ((_ref = this.subSystem) != null) {
        _ref.emitFor(particle);
      }
      this.particles.splice(this.particles.indexOf(particle), 1);
      return particle.constructor.release(particle);
    };

    /* src/particlejs/system.coffee<System::getTime> line:98 */;


    System.prototype.getTime = function() {
      return new Date().valueOf();
    };

    return System;

  })();

  /* src/particlejs/sub_system.coffee */;


  /* src/particlejs/sub_system.coffee<SubSystem> line:2 */;


  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    /* src/particlejs/sub_system.coffee<SubSystem::constructor> line:3 */;


    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    /* src/particlejs/sub_system.coffee<SubSystem::emitFor> line:6 */;


    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    return SubSystem;

  })(System);

  /* src/particlejs/mixins/poolable.coffee */;


  Mixin = mixinsjs.Mixin;

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

  /* src/particlejs/mixins/randomizable.coffee */;


  Mixin = mixinsjs.Mixin;

  Random = chancejs.Random, MathRandom = chancejs.MathRandom;

  DEFAULT_RANDOM = new Random(new MathRandom);

  /* src/particlejs/mixins/randomizable.coffee<Randomizable> line:7 */;


  Randomizable = (function(_super) {

    __extends(Randomizable, _super);

    function Randomizable() {
      return Randomizable.__super__.constructor.apply(this, arguments);
    }

    /* src/particlejs/mixins/randomizable.coffee<Randomizable::initRandom> line:8 */;


    Randomizable.prototype.initRandom = function() {
      return this.random || (this.random = DEFAULT_RANDOM);
    };

    return Randomizable;

  })(Mixin);

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

  /* src/particlejs/actions/force.coffee */;


  Point = geomjs;

  /* src/particlejs/actions/force.coffee<Force> line:5 */;


  Force = (function(_super) {

    __extends(Force, _super);

    /* src/particlejs/actions/force.coffee<Force::constructor> line:6 */;


    function Force(vector) {
      this.vector = vector != null ? vector : new Point;
    }

    /* src/particlejs/actions/force.coffee<Force::process> line:7 */;


    Force.prototype.process = function(particle) {
      particle.velocity.x += this.vector.x * this.biasInSeconds;
      return particle.velocity.y += this.vector.y * this.biasInSeconds;
    };

    return Force;

  })(BaseAction);

  /* src/particlejs/actions/friction.coffee */;


  /* src/particlejs/actions/friction.coffee<Friction> line:2 */;


  Friction = (function(_super) {

    __extends(Friction, _super);

    /* src/particlejs/actions/friction.coffee<Friction::constructor> line:3 */;


    function Friction(amount) {
      this.amount = amount != null ? amount : 1;
    }

    /* src/particlejs/actions/friction.coffee<Friction::process> line:4 */;


    Friction.prototype.process = function(particle) {
      var fx, fy;
      fx = particle.velocity.x * this.biasInSeconds * this.amount;
      fy = particle.velocity.y * this.biasInSeconds * this.amount;
      particle.velocity.x -= fx;
      return particle.velocity.y -= fy;
    };

    return Friction;

  })(BaseAction);

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

  /* src/particlejs/actions/macro_action.coffee */;


  /* src/particlejs/actions/macro_action.coffee<MacroAction> line:3 */;


  MacroAction = (function(_super) {

    __extends(MacroAction, _super);

    /* src/particlejs/actions/macro_action.coffee<MacroAction::constructor> line:4 */;


    function MacroAction(actions) {
      this.actions = actions != null ? actions : [];
    }

    /* src/particlejs/actions/macro_action.coffee<MacroAction::prepare> line:5 */;


    MacroAction.prototype.prepare = function(bias, biasInSeconds, time) {
      var action, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        _results.push(action.prepare(bias, biasInSeconds, time));
      }
      return _results;
    };

    /* src/particlejs/actions/macro_action.coffee<MacroAction::process> line:7 */;


    MacroAction.prototype.process = function(particle) {
      var action, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        _results.push(action.process(particle));
      }
      return _results;
    };

    return MacroAction;

  })(BaseAction);

  /* src/particlejs/actions/move.coffee */;


  /* src/particlejs/actions/move.coffee<Move> line:3 */;


  Move = (function(_super) {

    __extends(Move, _super);

    function Move() {
      return Move.__super__.constructor.apply(this, arguments);
    }

    /* src/particlejs/actions/move.coffee<Move::process> line:4 */;


    Move.prototype.process = function(particle) {
      particle.lastPosition.x = particle.position.x;
      particle.lastPosition.y = particle.position.y;
      particle.position.x += particle.velocity.x * this.biasInSeconds;
      return particle.position.y += particle.velocity.y * this.biasInSeconds;
    };

    return Move;

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
      this.offset = 1;
    }

    /* src/particlejs/counters/by_rate.coffee<ByRate::prepare> line:8 */;


    ByRate.prototype.prepare = function(bias, biasInSeconds, time) {
      this.rest += biasInSeconds * this.rate;
      this.count = Math.floor(this.rest);
      this.rest -= this.count;
      this.count += this.offset;
      return this.offset = 0;
    };

    return ByRate;

  })();

  /* src/particlejs/counters/fixed.coffee */;


  /* src/particlejs/counters/fixed.coffee<Fixed> line:2 */;


  Fixed = (function() {
    /* src/particlejs/counters/fixed.coffee<Fixed::constructor> line:3 */;

    function Fixed(count) {
      this.count = count != null ? count : 1;
    }

    /* src/particlejs/counters/fixed.coffee<Fixed::prepare> line:4 */;


    Fixed.prototype.prepare = function() {};

    return Fixed;

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

  /* src/particlejs/emitters/path.coffee */;


  /* src/particlejs/emitters/path.coffee<Path> line:2 */;


  Path = (function() {

    Randomizable.attachTo(Path);

    /* src/particlejs/emitters/path.coffee<Path::constructor> line:5 */;


    function Path(path, random) {
      this.path = path;
      this.random = random;
      this.initRandom();
    }

    /* src/particlejs/emitters/path.coffee<Path::get> line:7 */;


    Path.prototype.get = function() {
      return this.path.pathPointAt(this.random.get());
    };

    return Path;

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

  /* src/particlejs/emitters/surface.coffee */;


  /* src/particlejs/emitters/surface.coffee<Surface> line:2 */;


  Surface = (function() {

    Randomizable.attachTo(Surface);

    /* src/particlejs/emitters/surface.coffee<Surface::constructor> line:5 */;


    function Surface(surface, random) {
      this.surface = surface;
      this.random = random;
      this.initRandom();
    }

    /* src/particlejs/emitters/surface.coffee<Surface::get> line:7 */;


    Surface.prototype.get = function() {
      return this.surface.randomPointInSurface(this.random);
    };

    return Surface;

  })();

  /* src/particlejs/initializers/explosion.coffee */;


  /* src/particlejs/initializers/explosion.coffee<Explosion> line:2 */;


  Explosion = (function() {

    Randomizable.attachTo(Explosion);

    function Explosion(velocityMin, velocityMax, angleMin, angleMax, random) {
      this.velocityMin = velocityMin != null ? velocityMin : 0;
      this.velocityMax = velocityMax != null ? velocityMax : 1;
      this.angleMin = angleMin != null ? angleMin : 0;
      this.angleMax = angleMax != null ? angleMax : Math.PI * 2;
      this.random = random;
      this.initRandom();
    }

    /* src/particlejs/initializers/explosion.coffee<Explosion::initialize> line:11 */;


    Explosion.prototype.initialize = function(particle) {
      var angle, velocity;
      angle = this.random["in"](this.angleMin, this.angleMax);
      velocity = this.random["in"](this.velocityMin, this.velocityMax);
      particle.velocity.x = Math.cos(angle) * velocity;
      return particle.velocity.y = Math.sin(angle) * velocity;
    };

    return Explosion;

  })();

  /* src/particlejs/initializers/life.coffee */;


  /* src/particlejs/initializers/life.coffee<Life> line:2 */;


  Life = (function() {

    Randomizable.attachTo(Life);

    /* src/particlejs/initializers/life.coffee<Life::constructor> line:5 */;


    function Life(lifeMin, lifeMax, random) {
      this.lifeMin = lifeMin;
      this.lifeMax = lifeMax;
      this.random = random;
      if (this.lifeMax == null) {
        this.lifeMax = this.lifeMin;
      }
      this.initRandom();
    }

    /* src/particlejs/initializers/life.coffee<Life::initialize> line:9 */;


    Life.prototype.initialize = function(particle) {
      if (this.lifeMin === this.lifeMax) {
        return particle.maxLife = this.lifeMin;
      } else {
        return particle.maxLife = this.random["in"](this.lifeMin, this.lifeMax);
      }
    };

    return Life;

  })();

  /* src/particlejs/initializers/macro_initializer.coffee */;


  /* src/particlejs/initializers/macro_initializer.coffee<MacroInitializer> line:2 */;


  MacroInitializer = (function() {
    /* src/particlejs/initializers/macro_initializer.coffee<MacroInitializer::constructor> line:3 */;

    function MacroInitializer(initializers) {
      this.initializers = initializers;
    }

    /* src/particlejs/initializers/macro_initializer.coffee<MacroInitializer::initialize> line:5 */;


    MacroInitializer.prototype.initialize = function(particle) {
      var initializer, _i, _len, _ref, _results;
      _ref = this.initializers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        initializer = _ref[_i];
        _results.push(initializer.initialize(particle));
      }
      return _results;
    };

    return MacroInitializer;

  })();

  /* src/particlejs/initializers/null_initializer.coffee */;


  /* src/particlejs/initializers/null_initializer.coffee<NullInitializer> line:2 */;


  NullInitializer = (function() {

    function NullInitializer() {}

    /* src/particlejs/initializers/null_initializer.coffee<NullInitializer::initialize> line:3 */;


    NullInitializer.prototype.initialize = function() {};

    return NullInitializer;

  })();

  /* src/particlejs/initializers/particle_sub_system.coffee */;


  /* src/particlejs/initializers/particle_sub_system.coffee<ParticleSubSystem> line:3 */;


  ParticleSubSystem = (function() {
    /* src/particlejs/initializers/particle_sub_system.coffee<ParticleSubSystem::constructor> line:4 */;

    function ParticleSubSystem(initializer, action, emissionFactory, subSystem) {
      this.subSystem = new SubSystem(initializer, action, emissionFactory, subSystem);
    }

    /* src/particlejs/initializers/particle_sub_system.coffee<ParticleSubSystem::initialize> line:9 */;


    ParticleSubSystem.prototype.initialize = function(particle) {
      return this.subSystem.emitFor(particle);
    };

    return ParticleSubSystem;

  })();

  /* src/particlejs/initializers/stream.coffee */;


  Point = geomjs.Point;

  /* src/particlejs/initializers/stream.coffee<Stream> line:4 */;


  Stream = (function() {

    Randomizable.attachTo(Stream);

    function Stream(direction, velocityMin, velocityMax, angleRandom, random) {
      this.direction = direction != null ? direction : new Point(1, 1);
      this.velocityMin = velocityMin != null ? velocityMin : 0;
      this.velocityMax = velocityMax != null ? velocityMax : 1;
      this.angleRandom = angleRandom != null ? angleRandom : 0;
      this.random = random;
      this.initRandom();
    }

    /* src/particlejs/initializers/stream.coffee<Stream::initialize> line:13 */;


    Stream.prototype.initialize = function(particle) {
      var angle, velocity;
      velocity = this.random["in"](this.velocityMin, this.velocityMax);
      angle = this.direction.angle();
      if (this.angleRandom !== 0) {
        angle += this.random.pad(this.angleRandom);
      }
      particle.velocity.x = Math.cos(angle) * velocity;
      return particle.velocity.y = Math.sin(angle) * velocity;
    };

    return Stream;

  })();

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
      return this.parasite = {};
    };

    /* src/particlejs/particle.coffee<Particle::dispose> line:16 */;


    Particle.prototype.dispose = function() {
      this.position = null;
      this.lastPosition = null;
      this.velocity = null;
      return this.parasite = null;
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

  /* src/particlejs/sub_system.coffee */;


  /* src/particlejs/sub_system.coffee<SubSystem> line:2 */;


  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    /* src/particlejs/sub_system.coffee<SubSystem::constructor> line:3 */;


    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    /* src/particlejs/sub_system.coffee<SubSystem::emitFor> line:6 */;


    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    return SubSystem;

  })(System);

  /* src/particlejs/system.coffee */;


  /* src/particlejs/system.coffee<System> line:2 */;


  System = (function() {

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

    /* src/particlejs/system.coffee<System::emit> line:12 */;


    System.prototype.emit = function(emission) {
      this.emissions.push(emission);
      emission.system = this;
      return this.startEmission(emission);
    };

    /* src/particlejs/system.coffee<System::startEmission> line:17 */;


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

    /* src/particlejs/system.coffee<System::start> line:32 */;


    System.prototype.start = function() {
      if (!this.running) {
        Impulse.instance().add(this.tick, this);
        return this.running = true;
      }
    };

    /* src/particlejs/system.coffee<System::stop> line:37 */;


    System.prototype.stop = function() {
      if (this.running) {
        Impulse.instance().remove(this.tick, this);
        return this.running = false;
      }
    };

    /* src/particlejs/system.coffee<System::tick> line:42 */;


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

    /* src/particlejs/system.coffee<System::emitting> line:55 */;


    System.prototype.emitting = function() {
      return this.emissions.length > 0;
    };

    /* src/particlejs/system.coffee<System::processEmissions> line:57 */;


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

    /* src/particlejs/system.coffee<System::processEmission> line:62 */;


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

    /* src/particlejs/system.coffee<System::removeEmission> line:73 */;


    System.prototype.removeEmission = function(emission) {
      return this.emissions.splice(this.emissions.indexOf(emission), 1);
    };

    /* src/particlejs/system.coffee<System::processParticles> line:76 */;


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

    /* src/particlejs/system.coffee<System::initializeParticle> line:82 */;


    System.prototype.initializeParticle = function(particle, time) {
      this.initializer.initialize(particle);
      this.action.prepare(time, time / 1000, this.getTime());
      this.action.process(particle);
      if (particle.dead) {
        return this.unregisterParticle(particle);
      }
    };

    /* src/particlejs/system.coffee<System::registerParticle> line:89 */;


    System.prototype.registerParticle = function(particle) {
      return this.particles.push(particle);
    };

    /* src/particlejs/system.coffee<System::unregisterParticle> line:92 */;


    System.prototype.unregisterParticle = function(particle) {
      var _ref;
      this.died.push(particle);
      if ((_ref = this.subSystem) != null) {
        _ref.emitFor(particle);
      }
      this.particles.splice(this.particles.indexOf(particle), 1);
      return particle.constructor.release(particle);
    };

    /* src/particlejs/system.coffee<System::getTime> line:98 */;


    System.prototype.getTime = function() {
      return new Date().valueOf();
    };

    return System;

  })();

  /* src/particlejs/timers/instant.coffee */;


  /* src/particlejs/timers/instant.coffee<Instant> line:2 */;


  Instant = (function() {

    function Instant() {}

    /* src/particlejs/timers/instant.coffee<Instant::prepare> line:3 */;


    Instant.prototype.prepare = function() {};

    /* src/particlejs/timers/instant.coffee<Instant::finished> line:4 */;


    Instant.prototype.finished = function() {
      return true;
    };

    /* src/particlejs/timers/instant.coffee<Instant::nextTime> line:5 */;


    Instant.prototype.nextTime = function() {
      return 0;
    };

    return Instant;

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

  /* src/particlejs/timers/unlimited.coffee */;


  /* src/particlejs/timers/unlimited.coffee<Unlimited> line:2 */;


  Unlimited = (function(_super) {

    __extends(Unlimited, _super);

    /* src/particlejs/timers/unlimited.coffee<Unlimited::constructor> line:3 */;


    function Unlimited(since) {
      Unlimited.__super__.constructor.call(this, Infinity, since);
    }

    /* src/particlejs/timers/unlimited.coffee<Unlimited::finished> line:4 */;


    Unlimited.prototype.finished = function() {
      return false;
    };

    return Unlimited;

  })(Limited);

  /* src/particlejs/timers/until_death.coffee */;


  /* src/particlejs/timers/until_death.coffee<UntilDeath> line:2 */;


  UntilDeath = (function() {
    /* src/particlejs/timers/until_death.coffee<UntilDeath::constructor> line:3 */;

    function UntilDeath(particle) {
      this.particle = particle;
    }

    /* src/particlejs/timers/until_death.coffee<UntilDeath::prepare> line:5 */;


    UntilDeath.prototype.prepare = function(bias, biasInSeconds, time) {
      return this.nextTime = bias;
    };

    /* src/particlejs/timers/until_death.coffee<UntilDeath::finished> line:6 */;


    UntilDeath.prototype.finished = function() {
      return this.particle.dead;
    };

    return UntilDeath;

  })();

  this.particlejs.Signal = Signal;

  this.particlejs.Impulse = Impulse;

  this.particlejs.System = System;

  this.particlejs.SubSystem = SubSystem;

  this.particlejs.Poolable = Poolable;

  this.particlejs.Randomizable = Randomizable;

  this.particlejs.BaseAction = BaseAction;

  this.particlejs.Force = Force;

  this.particlejs.Friction = Friction;

  this.particlejs.Live = Live;

  this.particlejs.MacroAction = MacroAction;

  this.particlejs.Move = Move;

  this.particlejs.NullAction = NullAction;

  this.particlejs.ByRate = ByRate;

  this.particlejs.Fixed = Fixed;

  this.particlejs.NullCounter = NullCounter;

  this.particlejs.Emission = Emission;

  this.particlejs.NullEmitter = NullEmitter;

  this.particlejs.Path = Path;

  this.particlejs.Ponctual = Ponctual;

  this.particlejs.Surface = Surface;

  this.particlejs.Explosion = Explosion;

  this.particlejs.Life = Life;

  this.particlejs.MacroInitializer = MacroInitializer;

  this.particlejs.NullInitializer = NullInitializer;

  this.particlejs.ParticleSubSystem = ParticleSubSystem;

  this.particlejs.Stream = Stream;

  this.particlejs.Particle = Particle;

  this.particlejs.SubSystem = SubSystem;

  this.particlejs.System = System;

  this.particlejs.Instant = Instant;

  this.particlejs.Limited = Limited;

  this.particlejs.NullTimer = NullTimer;

  this.particlejs.Unlimited = Unlimited;

  this.particlejs.UntilDeath = UntilDeath;

}).call(this);
