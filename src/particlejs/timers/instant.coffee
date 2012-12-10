mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class Instant
  include([
    Inlinable()
    Cloneable()
    Sourcable('particlejs.Instant')
  ]).in Instant

  prepare: -> @nextTime = 0
  finished: -> true

module.exports = Instant
