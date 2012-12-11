geomjs = require 'geomjs'
mixinsjs = require 'mixinsjs'

{Point} = geomjs
{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class Ponctual
  include([
    Inlinable(
      noconstructor: true
      inlinedProperties: ['point']
      mapSource:
        get: 'return this.point;'
    )
    Cloneable('point')
    Sourcable('particlejs.Ponctual','point')
  ]).in Ponctual

  constructor: (@point=new Point) ->
  get: -> @point.clone()

module.exports = Ponctual
