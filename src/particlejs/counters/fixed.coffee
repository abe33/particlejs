mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
class Fixed
  include([
    Inlinable(
      inlinedProperties: ['count']
      mapSource:
        prepare: 'count = this.count;'
    )
    Cloneable('count')
    Sourcable('particlejs.Fixed','count')
  ]).in Fixed

  constructor: (@count=1) ->
  prepare: ->

module.exports = Fixed
