(function() {
  var ByRate, Emission, Life, Limited, Mixin, NullCounter, NullEmitter, NullInitializer, NullTimer, Particle, Point, Ponctual, Poolable,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.particlejs || (this.particlejs = {});

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
      return this.iterator / this.currentCount * this.currentTime;
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

  this.particlejs.ByRate = ByRate;

  this.particlejs.NullCounter = NullCounter;

  this.particlejs.Emission = Emission;

  this.particlejs.NullEmitter = NullEmitter;

  this.particlejs.Ponctual = Ponctual;

  this.particlejs.Life = Life;

  this.particlejs.NullInitializer = NullInitializer;

  this.particlejs.Poolable = Poolable;

  this.particlejs.Particle = Particle;

  this.particlejs.Limited = Limited;

  this.particlejs.NullTimer = NullTimer;

}).call(this);
