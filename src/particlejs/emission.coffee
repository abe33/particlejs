mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs

Particle = require './particle'
NullTimer = require './timers/null_timer'
NullCounter = require './counters/null_counter'
NullEmitter = require './emitters/null_emitter'

PROPERTIES = ['particleType','emitter','timer','counter','initializer']

class Emission
  include([
    Cloneable.apply(null, PROPERTIES)
  ]).in Emission

  constructor: (@particleType=Particle,
                @emitter=new NullEmitter(),
                @timer=new NullTimer(),
                @counter=new NullCounter(),
                @initializer=null) ->

  prepare: (bias, biasInSeconds, time) ->
    @timer.prepare bias, biasInSeconds, time

    nextTime = @timer.nextTime
    @counter.prepare nextTime, nextTime / 1000, time

    @currentCount = @counter.count
    @currentTime = nextTime
    @iterator = 0

  hasNext: -> @iterator < @currentCount
  next: ->
    particle = @particleType.get position: @emitter.get()
    @initializer?.initialize particle
    @iterator++

    particle

  nextTime: -> @currentTime - @iterator / @currentCount * @currentTime

  finished: -> @timer.finished()

  compile: ->
    "{
      iterator: 0,
      init: function(){
        #{@emitter?.sourceFragment('constructor')}
        #{@timer?.sourceFragment('constructor')}
        #{@counter?.sourceFragment('constructor')}
        #{@initializer?.sourceFragment('constructor')}
      },
      prepare: function(bias, biasInSeconds, time) {
        var count = 0, nextTime = 0;

        #{@timer?.sourceFragment('prepare')}

        #{@counter?.sourceFragment('prepare')}

        this.nextTime = nextTime;
        this.count = count;
      },
      hasNext: function(){
        return this.iterator < this.currentCount;
      },
      next: function(){
        var get, particle;
        #{@emitter?.sourceFragment('get')}

        particle = particlejs.Particle.get({position: get});
        particle.position.x = get.x;
        particle.position.y = get.y;

        #{@initializer?.sourceFragment('initialize')}

        this.iterator++;
        return particle;
      },
      nextTime: function(){
        return this.nextTime;
      },
      finished: function(){
        var finished = true;

        #{@timer?.sourceFragment('finished')}

        return finished;
      }
    }"

  toSource: ->
    args = [@particleType.source]
    ['emitter','timer','counter','initializer'].forEach (p) =>
      args.push @[p].toSource()

    "new particlejs.Emission(#{args.join ','})"

module.exports = Emission
