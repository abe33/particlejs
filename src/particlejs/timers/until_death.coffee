mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class UntilDeath
  include([
    Inlinable(noconstructor: true)
    Cloneable('duration','particle')
    Sourcable('particlejs.UntilDeath')
  ]).in UntilDeath

  constructor: (@particle) ->

  prepare: (bias, biasInSeconds, time) -> @nextTime = bias
  finished: -> @particle.dead

module.exports = UntilDeath
