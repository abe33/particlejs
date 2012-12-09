
class UntilDeath
  constructor: (@particle) ->

  prepare: (bias, biasInSeconds, time) -> @nextTime = bias
  finished: -> @particle.dead

module.exports = UntilDeath
