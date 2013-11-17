(function() {
  var Cloneable, Emission, Sourcable, SubEmission, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Emission = require('./emission');

  SubEmission = (function(_super) {

    __extends(SubEmission, _super);

    SubEmission.source = 'particlejs.SubEmission';

    function SubEmission(particle, particleType, emitter, timer, counter, initializer) {
      this.particle = particle;
      SubEmission.__super__.constructor.call(this, particleType, emitter, timer, counter, initializer);
    }

    SubEmission.prototype.getArgumentsSource = function() {
      var args,
        _this = this;
      args = ['null', this.particleType.source];
      ['emitter', 'timer', 'counter', 'initializer'].forEach(function(p) {
        return args.push(_this[p].toSource());
      });
      return args;
    };

    return SubEmission;

  })(Emission);

  module.exports = SubEmission;

}).call(this);
