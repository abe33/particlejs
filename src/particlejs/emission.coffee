
Particle = require './particle'
NullTimer = require './timers/null_timer'
NullCounter = require './counters/null_counter'
NullEmitter = require './emitters/null_emitter'

class Emission
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

  nextTime: -> @iterator / @currentCount * @currentTime

  finished: -> @timer.finished()

module.exports = Emission
