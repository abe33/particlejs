(function() {
  var Cloneable, Particle, Sourcable, SubSystem, System, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  System = require('./system');

  Particle = require('./particle');

  SubSystem = (function(_super) {

    __extends(SubSystem, _super);

    SubSystem.source = 'particlejs.SubSystem';

    include([Cloneable('initializer', 'action', 'subSystem')])["in"](SubSystem);

    function SubSystem(initializer, action, emissionFactory, subSystem) {
      this.emissionFactory = emissionFactory;
      SubSystem.__super__.constructor.call(this, initializer, action, subSystem);
    }

    SubSystem.prototype.emitFor = function(particle) {
      return this.emit(this.emissionFactory(particle));
    };

    SubSystem.prototype.compile = function() {
      return "(function(){\nvar CustomSubSystem,\n  __hasProp = {}.hasOwnProperty,\n  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n\nCustomSubSystem = (function(_super) {\n\n  __extends(CustomSubSystem, _super);\n\n  function CustomSubSystem(){\n    CustomSubSystem.__super__.constructor.call(this);\n    " + (this.initializer.sourceFragment('constructor')) + "\n    " + (this.action.sourceFragment('constructor')) + "\n    this.emissionFactory = " + (this.emissionFactory.toString()) + ";\n  };\n\n  CustomSubSystem.prototype.initializeParticle = function(particle, bias){\n    var biasInSeconds = bias / 1000, time = this.getTime();\n    " + (this.initializer.sourceFragment('initialize')) + "\n  };\n\n  CustomSubSystem.prototype.processParticles = function(bias, biasInSeconds, time){\n    var particle, _i, _len, _ref;\n\n    " + (this.action.sourceFragment('prepare')) + "\n    _ref = this.particles.concat();\n    for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n      particle = _ref[_i];\n      " + (this.action.sourceFragment('process')) + "\n      if (particle.dead) {\n        this.unregisterParticle(particle)\n      }\n    }\n  };\n\n})(particlejs.SubSystem);\n\nreturn new CustomSubSystem;\n})()";
    };

    SubSystem.prototype.getArgumentsSource = function() {
      var _this = this;
      return ['initializer', 'action', 'emissionFactory', 'subSystem'].select(function(p) {
        return _this[p] != null;
      }).map(function(p) {
        if (_this[p].toSource != null) {
          return _this[p].toSource();
        } else {
          return _this[p].toString();
        }
      });
    };

    return SubSystem;

  })(System);

  module.exports = SubSystem;

}).call(this);
