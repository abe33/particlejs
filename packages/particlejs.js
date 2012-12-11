(function() {
  var $w, BaseAction, ByRate, Cloneable, DEFAULT_RANDOM, DieOnSurface, EMPTY_FUNCTION, Emission, Explosion, Fixed, Force, Friction, Impulse, Inlinable, Instant, KEYWORDS, KEYWORDS_RE, Life, Limited, Live, MacroAction, MacroInitializer, MathRandom, Mixin, Move, NullAction, NullCounter, NullEmitter, NullInitializer, NullTimer, PROPERTIES, Particle, ParticleSubSystem, Path, Point, Ponctual, Poolable, RETURNING_METHODS, RETURN_RE, Random, Randomizable, STRIP_RE, Signal, Sourcable, Stream, SubSystem, Surface, System, THIS_AND_KEYWORDS_RE, Unlimited, UntilDeath, include, requestAnimationFrame,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.particlejs || (this.particlejs = {});

  /* src/vendor/signal.coffee */;


  Signal = (function() {

    function Signal() {
      this.listeners = [];
    }

    Signal.prototype.add = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      if (!this.registered(listener, context)) {
        this.listeners.push([listener, context, false, priority]);
        return this.sortListeners();
      }
    };

    Signal.prototype.addOnce = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      if (!this.registered(listener, context)) {
        this.listeners.push([listener, context, true, priority]);
        return this.sortListeners();
      }
    };

    Signal.prototype.remove = function(listener, context) {
      if (this.registered(listener, context)) {
        return this.listeners.splice(this.indexOf(listener, context), 1);
      }
    };

    Signal.prototype.removeAll = function() {
      return this.listeners = [];
    };

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

    Signal.prototype.registered = function(listener, context) {
      return this.indexOf(listener, context) !== -1;
    };

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

  Impulse = (function(_super) {

    __extends(Impulse, _super);

    Impulse.instance = function() {
      return this._instance || (this._instance = new Impulse);
    };

    function Impulse(timeScale) {
      this.timeScale = timeScale != null ? timeScale : 1;
      Impulse.__super__.constructor.call(this);
      this.running = false;
    }

    Impulse.prototype.add = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.add.call(this, listener, context, priority);
      if (this.hasListeners() && !this.running) {
        return this.start();
      }
    };

    Impulse.prototype.remove = function(listener, context, priority) {
      if (priority == null) {
        priority = 0;
      }
      Impulse.__super__.remove.call(this, listener, context, priority);
      if (this.running && !this.hasListeners()) {
        return this.stop();
      }
    };

    Impulse.prototype.hasListeners = function() {
      return this.listeners.length > 0;
    };

    Impulse.prototype.start = function() {
      this.running = true;
      return this.initRun();
    };

    Impulse.prototype.stop = function() {
      return this.running = false;
    };

    Impulse.prototype.initRun = function() {
      var _this = this;
      this.time = this.getTime();
      return requestAnimationFrame(function() {
        return _this.run();
      });
    };

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

    Impulse.prototype.getTime = function() {
      return new Date().getTime();
    };

    return Impulse;

  })(Signal);

  /* src/particlejs/system.coffee */;


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

    return System;

  })();

  /* src/particlejs/sub_system.coffee */;


  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    return SubSystem;

  })(System);

  /* src/particlejs/mixins/inlinable.coffee */;


  Mixin = mixinsjs.Mixin;

  $w = function(s) {
    return s.split(/\s+/g);
  };

  KEYWORDS = $w('biasInSeconds bias time nextTime');

  RETURNING_METHODS = $w('finished get');

  EMPTY_FUNCTION = function() {
    return /^function\s*([^(]+\s*)*\([^)]*\)\s*\{\}/gm;
  };

  STRIP_RE = function() {
    return /(^\s*|\s*$)/gm;
  };

  RETURN_RE = function() {
    return /return\s*([^;]+);/gm;
  };

  THIS_AND_KEYWORDS_RE = function() {
    return RegExp("this\\.(" + (KEYWORDS.join('|')) + ")", "gm");
  };

  KEYWORDS_RE = function() {
    var a;
    a = KEYWORDS.map(function(k) {
      return "" + k + "\\s*=\\s*" + k;
    });
    return RegExp("(" + (a.join('|')) + ");", "gm");
  };

  Inlinable = function(options) {
    var ConcreteInlinable;
    if (options == null) {
      options = {};
    }
    return ConcreteInlinable = (function(_super) {

      __extends(ConcreteInlinable, _super);

      function ConcreteInlinable() {
        return ConcreteInlinable.__super__.constructor.apply(this, arguments);
      }

      ConcreteInlinable.prototype.sourceFragment = function(member) {
        var RE, asource, isConstructor, removeInlinedPropertiesAffectation, replaceInlinedPropertiesWithValues, replacePropertiesWithSource, source, sourceMapped, _ref,
          _this = this;
        isConstructor = member === 'constructor';
        source = this[member];
        if (isConstructor && options["super"]) {
          source = source.__super__.constructor;
        }
        sourceMapped = false;
        if (((_ref = options.mapSource) != null ? _ref[member] : void 0) != null) {
          if (!(isConstructor && typeof options.mapSource[member] === 'function')) {
            source = options.mapSource[member];
            if (typeof source === 'function') {
              source = source.call(this);
            }
            sourceMapped = true;
          }
        }
        if (!sourceMapped) {
          source = source.toString();
          if (EMPTY_FUNCTION().test(source)) {
            return '';
          }
          if (isConstructor && options.noconstructor) {
            return '';
          }
          asource = source.split('\n');
          asource.shift();
          asource.pop();
          if (isConstructor) {
            asource = asource.filter(function(l) {
              return !RegExp("" + (KEYWORDS.join('|'))).test(l);
            });
          }
          source = asource.join('\n');
        }
        removeInlinedPropertiesAffectation = function(source) {
          var RE;
          RE = RegExp("this\\.(" + (options.inlinedProperties.join('|')) + ")\\s*=[^=]+[^\\n]+", "g");
          return source.replace(RE, '');
        };
        replaceInlinedPropertiesWithValues = function(source) {
          var RE;
          RE = RegExp("this\\.(" + (options.inlinedProperties.join('|')) + ")", "g");
          return source.replace(RE, function(m, p) {
            if (_this[p].toSource != null) {
              return _this[p].toSource();
            } else {
              return _this[p];
            }
          });
        };
        replacePropertiesWithSource = function(source) {
          var RE;
          RE = /@([$A-Za-z_][$A-Za-z0-9_]*)/g;
          return source.replace(RE, function(m, p) {
            if (_this[p].toSource != null) {
              return _this[p].toSource();
            } else {
              return _this[p];
            }
          });
        };
        source = source.replace(THIS_AND_KEYWORDS_RE(), '$1').replace(KEYWORDS_RE(), '');
        if (options.keywords != null) {
          RE = RegExp("this\\.(" + (options.keywords.join('|')) + ")", "gm");
          source = source.replace(RE, '$1');
        }
        if (options.inlinedProperties != null) {
          source = removeInlinedPropertiesAffectation(source);
          source = replaceInlinedPropertiesWithValues(source);
        }
        source = replacePropertiesWithSource(source);
        if (__indexOf.call(RETURNING_METHODS, member) >= 0) {
          source = source.replace(RETURN_RE(), "" + member + " = $1;");
        } else {
          source = source.replace(RETURN_RE(), '$1;');
        }
        return source.replace(STRIP_RE(), '');
      };

      return ConcreteInlinable;

    })(Mixin);
  };

  /* src/particlejs/mixins/poolable.coffee */;


  Mixin = mixinsjs.Mixin;

  Poolable = (function(_super) {

    __extends(Poolable, _super);

    function Poolable() {
      return Poolable.__super__.constructor.apply(this, arguments);
    }

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

  Randomizable = (function(_super) {

    __extends(Randomizable, _super);

    function Randomizable() {
      return Randomizable.__super__.constructor.apply(this, arguments);
    }

    Randomizable.prototype.initRandom = function() {
      return this.random || (this.random = DEFAULT_RANDOM);
    };

    return Randomizable;

  })(Mixin);

  /* src/particlejs/actions/base_action.coffee */;


  BaseAction = (function() {

    function BaseAction() {}

    BaseAction.prototype.prepare = function(bias, biasInSeconds, time) {
      this.bias = bias;
      this.biasInSeconds = biasInSeconds;
      this.time = time;
    };

    return BaseAction;

  })();

  /* src/particlejs/actions/die_on_surface.coffee */;


  DieOnSurface = (function() {

    function DieOnSurface(surfaces) {
      this.surfaces = surfaces;
      if (Object.prototype.toString.call(this.surface).indexOf('Array') === -1) {
        this.surfaces = [this.surfaces];
      }
    }

    DieOnSurface.prototype.prepare = function() {};

    DieOnSurface.prototype.process = function(p) {
      var surface, _i, _len, _ref;
      _ref = this.surfaces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        surface = _ref[_i];
        if (surface.contains(p.position)) {
          return p.die();
        }
      }
    };

    return DieOnSurface;

  })();

  /* src/particlejs/actions/force.coffee */;


  Point = geomjs;

  Force = (function(_super) {

    __extends(Force, _super);

    function Force(vector) {
      this.vector = vector != null ? vector : new Point;
    }

    Force.prototype.process = function(particle) {
      particle.velocity.x += this.vector.x * this.biasInSeconds;
      return particle.velocity.y += this.vector.y * this.biasInSeconds;
    };

    return Force;

  })(BaseAction);

  /* src/particlejs/actions/friction.coffee */;


  Friction = (function(_super) {

    __extends(Friction, _super);

    function Friction(amount) {
      this.amount = amount != null ? amount : 1;
    }

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


  Live = (function(_super) {

    __extends(Live, _super);

    function Live() {
      return Live.__super__.constructor.apply(this, arguments);
    }

    Live.prototype.process = function(particle) {
      particle.life += this.bias;
      if (particle.life >= particle.maxLife) {
        return particle.die();
      }
    };

    return Live;

  })(BaseAction);

  /* src/particlejs/actions/macro_action.coffee */;


  MacroAction = (function(_super) {

    __extends(MacroAction, _super);

    function MacroAction(actions) {
      this.actions = actions != null ? actions : [];
    }

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


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Move = (function(_super) {

    __extends(Move, _super);

    function Move() {
      return Move.__super__.constructor.apply(this, arguments);
    }

    include([
      Inlinable({
        noconstructor: true
      }), Cloneable(), Sourcable('particlejs.Move')
    ])["in"](Move);

    Move.prototype.process = function(particle) {
      particle.lastPosition.x = particle.position.x;
      particle.lastPosition.y = particle.position.y;
      particle.position.x += particle.velocity.x * this.biasInSeconds;
      return particle.position.y += particle.velocity.y * this.biasInSeconds;
    };

    return Move;

  })(BaseAction);

  /* src/particlejs/actions/null_action.coffee */;


  NullAction = (function() {

    function NullAction() {}

    NullAction.prototype.prepare = function() {};

    NullAction.prototype.process = function() {};

    return NullAction;

  })();

  /* src/particlejs/counters/by_rate.coffee */;


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  ByRate = (function() {

    include([
      Inlinable({
        inlinedProperties: ['rate'],
        keywords: ['count']
      }), Cloneable('rate'), Sourcable('particlejs.ByRate', 'rate')
    ])["in"](ByRate);

    function ByRate(rate) {
      this.rate = rate != null ? rate : 1;
      this.count = 0;
      this.rest = 0;
      this.offset = 1;
    }

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


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Fixed = (function() {

    include([
      Inlinable({
        inlinedProperties: ['count'],
        mapSource: {
          prepare: 'count = this.count;'
        }
      }), Cloneable('count'), Sourcable('particlejs.Fixed', 'count')
    ])["in"](Fixed);

    function Fixed(count) {
      this.count = count != null ? count : 1;
    }

    Fixed.prototype.prepare = function() {};

    return Fixed;

  })();

  /* src/particlejs/counters/null_counter.coffee */;


  NullCounter = (function() {

    function NullCounter() {}

    NullCounter.prototype.count = 0;

    NullCounter.prototype.prepare = function() {};

    return NullCounter;

  })();

  /* src/particlejs/emission.coffee */;


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

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

  /* src/particlejs/emitters/null_emitter.coffee */;


  Point = geomjs.Point;

  NullEmitter = (function() {

    function NullEmitter() {}

    NullEmitter.prototype.get = function() {
      return new Point;
    };

    return NullEmitter;

  })();

  /* src/particlejs/emitters/path.coffee */;


  Path = (function() {

    Randomizable.attachTo(Path);

    function Path(path, random) {
      this.path = path;
      this.random = random;
      this.initRandom();
    }

    Path.prototype.get = function() {
      return this.path.pathPointAt(this.random.get());
    };

    return Path;

  })();

  /* src/particlejs/emitters/ponctual.coffee */;


  Point = geomjs.Point;

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Ponctual = (function() {

    include([
      Inlinable({
        noconstructor: true,
        inlinedProperties: ['point'],
        mapSource: {
          get: 'return this.point;'
        }
      }), Cloneable('point'), Sourcable('particlejs.Ponctual', 'point')
    ])["in"](Ponctual);

    function Ponctual(point) {
      this.point = point != null ? point : new Point;
    }

    Ponctual.prototype.get = function() {
      return this.point.clone();
    };

    return Ponctual;

  })();

  /* src/particlejs/emitters/surface.coffee */;


  Surface = (function() {

    Randomizable.attachTo(Surface);

    function Surface(surface, random) {
      this.surface = surface;
      this.random = random;
      this.initRandom();
    }

    Surface.prototype.get = function() {
      return this.surface.randomPointInSurface(this.random);
    };

    return Surface;

  })();

  /* src/particlejs/initializers/explosion.coffee */;


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


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Life = (function() {

    include([
      Inlinable({
        inlinedProperties: ['lifeMin', 'lifeMax'],
        mapSource: {
          constructor: 'this.random = @random;',
          initialize: function() {
            if (this.lifeMax === this.lifeMin) {
              return 'particle.maxLife = @lifeMin;';
            } else {
              return 'particle.maxLife = this.random["in"](@lifeMin, @lifeMax);';
            }
          }
        }
      }), Cloneable('lifeMin', 'lifeMax', 'random'), Sourcable('particlejs.Life', 'lifeMin', 'lifeMax', 'random'), Randomizable
    ])["in"](Life);

    function Life(lifeMin, lifeMax, random) {
      this.lifeMin = lifeMin;
      this.lifeMax = lifeMax;
      this.random = random;
      if (this.lifeMax == null) {
        this.lifeMax = this.lifeMin;
      }
      this.initRandom();
    }

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


  MacroInitializer = (function() {

    function MacroInitializer(initializers) {
      this.initializers = initializers;
    }

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


  NullInitializer = (function() {

    function NullInitializer() {}

    NullInitializer.prototype.initialize = function() {};

    return NullInitializer;

  })();

  /* src/particlejs/initializers/particle_sub_system.coffee */;


  ParticleSubSystem = (function() {

    function ParticleSubSystem(initializer, action, emissionFactory, subSystem) {
      this.subSystem = new SubSystem(initializer, action, emissionFactory, subSystem);
    }

    ParticleSubSystem.prototype.initialize = function(particle) {
      return this.subSystem.emitFor(particle);
    };

    return ParticleSubSystem;

  })();

  /* src/particlejs/initializers/stream.coffee */;


  Point = geomjs.Point;

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

  Particle = (function() {

    function Particle() {}

    Particle.source = 'particlejs.Particle';

    Poolable.attachTo(Particle);

    Particle.prototype.init = function() {
      this.dead = false;
      this.life = 0;
      this.maxLife = 0;
      this.position = new Point;
      this.lastPosition = new Point;
      this.velocity = new Point;
      return this.parasite = {};
    };

    Particle.prototype.dispose = function() {
      this.position = null;
      this.lastPosition = null;
      this.velocity = null;
      return this.parasite = null;
    };

    Particle.prototype.die = function() {
      this.dead = true;
      return this.life = this.maxLife;
    };

    Particle.prototype.revive = function() {
      this.dead = false;
      return this.life = 0;
    };

    return Particle;

  })();

  /* src/particlejs/sub_system.coffee */;


  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    return SubSystem;

  })(System);

  /* src/particlejs/system.coffee */;


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

    return System;

  })();

  /* src/particlejs/timers/instant.coffee */;


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Instant = (function() {

    function Instant() {}

    include([Inlinable(), Cloneable(), Sourcable('particlejs.Instant')])["in"](Instant);

    Instant.prototype.prepare = function() {
      return this.nextTime = 0;
    };

    Instant.prototype.finished = function() {
      return true;
    };

    return Instant;

  })();

  /* src/particlejs/timers/limited.coffee */;


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Limited = (function() {

    include([
      Inlinable({
        inlinedProperties: ['duration', 'since']
      }), Cloneable('duration', 'since'), Sourcable('particlejs.Limited', 'duration', 'since')
    ])["in"](Limited);

    function Limited(duration, since) {
      this.duration = duration != null ? duration : 1000;
      this.since = since != null ? since : 0;
      this.elapsed = 0;
      this.nextTime = 0;
    }

    Limited.prototype.prepare = function(bias, biasInSeconds, time) {
      if (!this.firstTime) {
        this.nextTime = this.since + bias;
        this.firstTime = true;
      } else {
        this.nextTime = bias;
      }
      return this.elapsed += bias;
    };

    Limited.prototype.finished = function() {
      return this.elapsed >= this.duration;
    };

    return Limited;

  })();

  /* src/particlejs/timers/null_timer.coffee */;


  NullTimer = (function() {

    function NullTimer() {}

    NullTimer.prototype.nextTime = 0;

    NullTimer.prototype.prepare = function() {};

    NullTimer.prototype.finished = function() {
      return true;
    };

    return NullTimer;

  })();

  /* src/particlejs/timers/unlimited.coffee */;


  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Unlimited = (function(_super) {

    __extends(Unlimited, _super);

    include([
      Inlinable({
        inlinedProperties: ['duration', 'since'],
        "super": true
      }), Cloneable('since'), Sourcable('particlejs.Unlimited', 'since')
    ])["in"](Unlimited);

    function Unlimited(since) {
      Unlimited.__super__.constructor.call(this, Infinity, since);
    }

    Unlimited.prototype.finished = function() {
      return false;
    };

    return Unlimited;

  })(Limited);

  /* src/particlejs/timers/until_death.coffee */;


  UntilDeath = (function() {

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

  this.particlejs.Signal = Signal;

  this.particlejs.Impulse = Impulse;

  this.particlejs.System = System;

  this.particlejs.SubSystem = SubSystem;

  this.particlejs.Inlinable = Inlinable;

  this.particlejs.Poolable = Poolable;

  this.particlejs.Randomizable = Randomizable;

  this.particlejs.BaseAction = BaseAction;

  this.particlejs.DieOnSurface = DieOnSurface;

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
