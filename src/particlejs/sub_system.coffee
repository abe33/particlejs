mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
System = require './system'

class SubSystem extends System
  @source = 'particlejs.SubSystem'
  include([
    Cloneable('initializer','action','subSystem'),
  ]).in SubSystem

  constructor: (initializer, action, @emissionFactory, subSystem) ->
    super initializer, action, subSystem

  emitFor: (particle) -> @emit @emissionFactory particle

  compile: ->
    """(function(){
  var CustomSubSystem,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CustomSubSystem = (function(_super) {

    __extends(CustomSubSystem, _super);

    function CustomSubSystem(){
      CustomSubSystem.__super__.constructor.call(this);
      #{@initializer.sourceFragment 'constructor'}
      #{@action.sourceFragment 'constructor'}
      this.emissionFactory = function(particle){
        return (function(){
          // TODO
        })();
      };
    };

    CustomSubSystem.prototype.initializeParticle = function(particle, bias){
      var biasInSeconds = bias / 1000, time = this.getTime();
      #{@initializer.sourceFragment 'initialize'}
    };

    CustomSubSystem.prototype.processParticles = function(bias, biasInSeconds, time){
      var particle, _i, _len, _ref;

      #{@action.sourceFragment 'prepare'}
      _ref = this.particles.concat();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particle = _ref[_i];
        #{@action.sourceFragment 'process'}
        if (particle.dead) {
          this.unregisterParticle(particle)
        }
      }
    };

  })(particlejs.SubSystem);

  return new CustomSubSystem;
})()"""

  getArgumentsSource: ->
    ['initializer','action','emissionFactory','subSystem']
    .select((p) => @[p]?)
    .map((p) => if @[p].toSource? then @[p].toSource() else @[p].toString())

module.exports = SubSystem
