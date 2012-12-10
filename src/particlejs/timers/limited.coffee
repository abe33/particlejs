mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class Limited
  include([
    Inlinable(inlinedProperties: ['duration','since'])
    Cloneable('duration','since')
    Sourcable('particlejs.Limited','duration','since')
  ]).in Limited

  constructor: (@duration=1000, @since=0) ->
    @elapsed = 0
    @nextTime = 0

  prepare: (bias, biasInSeconds, time) ->
    unless @firstTime
      @nextTime = @since + bias
      @firstTime = true
    else
      @nextTime = bias
    @elapsed += bias

  finished: -> @elapsed >= @duration

module.exports = Limited
