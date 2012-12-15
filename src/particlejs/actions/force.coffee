geomjs = require 'geomjs'
mixinsjs = require 'mixinsjs'

{Point} = geomjs
{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
BaseAction = require './base_action'

class Force extends BaseAction
  include([
    Inlinable(
      rename:
        vector: 'forceVector'
      mapSource:
        constructor: 'this.vector = @vector;'
      )
    Cloneable('vector')
    Sourcable('particlejs.Force','vector')
  ]).in Force

  constructor: (@vector=new Point) ->
  process: (particle) ->
    particle.velocity.x += @vector.x * @biasInSeconds
    particle.velocity.y += @vector.y * @biasInSeconds

module.exports = Force
