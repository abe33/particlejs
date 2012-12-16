mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs

Signal = require '../vendor/signal'
Impulse = require '../vendor/impulse'
NullInitializer = require './initializers/null_initializer'
NullAction = require './actions/null_action'

class System
  @source = 'particlejs.System'
  include([
    Cloneable('initializer','action','subSystem'),
  ]).in System

  constructor: (@initializer=new NullInitializer,
                @action= new NullAction, @subSystem) ->
    @particlesCreated = new Signal
    @particlesDied = new Signal
    @emissionStarted = new Signal
    @emissionFinished = new Signal
    @particles = []
    @emissions = []

  emit: (emission) ->
    @emissions.push emission
    emission.system = this
    @startEmission emission

  startEmission: (emission) ->
    emission.prepare 0, 0, @getTime()
    @created = []
    @died = []

    @start() unless @running
    @processEmission emission

    @emissionStarted.dispatch this, emission
    @particlesCreated.dispatch this, @created if @created.length > 0
    @particlesDied.dispatch this, @died if @died.length > 0

    @died = null
    @created = null

  start: ->
    unless @running
      Impulse.instance().add @tick, this
      @running = true

  stop: ->
    if @running
      Impulse.instance().remove @tick, this
      @running = false

  tick: (bias, biasInSeconds, time) ->
    @died = []
    @created = []

    @processParticles bias, biasInSeconds, time
    @processEmissions bias, biasInSeconds, time if @emitting()

    @particlesCreated.dispatch this, @created if @created.length > 0
    @particlesDied.dispatch this, @died if @died.length > 0

    @died = null
    @created = null

  emitting: -> @emissions.length > 0

  processEmissions: (bias, biasInSeconds, time) ->
    for emission in @emissions.concat()
      emission.prepare bias, biasInSeconds, time
      @processEmission emission

  processEmission: (emission) ->
    while emission.hasNext()
      time = emission.nextTime()
      particle = emission.next()
      @created.push particle
      @registerParticle particle
      @initializeParticle particle, time
      if emission.finished()
        @removeEmission emission
        @emissionFinished.dispatch this, emission

  removeEmission: (emission) ->
    @emissions.splice @emissions.indexOf(emission), 1

  processParticles: (bias, biasInSeconds, time) ->
    @action.prepare bias, biasInSeconds, time
    for particle in @particles.concat()
      @action.process particle
      @unregisterParticle particle if particle.dead
    return

  initializeParticle: (particle, time) ->
    @initializer.initialize particle
    @action.prepare time, time / 1000, @getTime()
    @action.process particle

    @unregisterParticle particle if particle.dead

  registerParticle: (particle) ->
    @particles.push particle

  unregisterParticle: (particle) ->
    @died.push particle
    @subSystem?.emitFor particle
    @particles.splice @particles.indexOf(particle), 1
    particle.constructor.release particle

  getTime: -> new Date().valueOf()

  compile: ->
    """(function(){
  var CustomSystem,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CustomSystem = (function(_super) {

    __extends(CustomSystem, _super);

    function CustomSystem(){
      CustomSystem.__super__.constructor.call(this);
      #{@initializer.sourceFragment 'constructor'}
      #{@action.sourceFragment 'constructor'}
      this.subSystem = (function() {
        // TODO
      })();
    };

    CustomSystem.prototype.initializeParticle = function(particle, bias){
      var biasInSeconds = bias / 1000, time = this.getTime();
      #{@initializer.sourceFragment 'initialize'}
    };

    CustomSystem.prototype.processParticles = function(bias, biasInSeconds, time){
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

  })(particlejs.System);

  return new CustomSystem;
})()
"""

  toSource: ->
    args = @getArgumentsSource()

    "new #{@constructor.source}(#{args.join ','})"

  getArgumentsSource: ->
    ['initializer','action','subSystem']
    .select((p) => @[p]?)
    .map((p) => @[p].toSource())


module.exports = System
