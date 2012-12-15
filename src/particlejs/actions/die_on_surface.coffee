mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class DieOnSurface
  include([
    Inlinable(
      mapSource:
        constructor: 'this.deathSurfaces = @surfaces;'
      rename:
        'return p\\.die\\(\\);': 'p.die(); break;'
        surfaces: 'deathSurfaces'
    )
    Cloneable('surfaces')
    Sourcable('particlejs.DieOnSurface','surfaces')
  ]).in DieOnSurface

  constructor: (@surfaces) ->
    if Object::toString.call(@surface).indexOf('Array') is -1
      @surfaces = [@surfaces]

  prepare: ->
  process: (p) ->
    return p.die() for surface in @surfaces when surface.contains p.position

module.exports = DieOnSurface
