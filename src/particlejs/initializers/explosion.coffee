
mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
Randomizable = require '../mixins/randomizable'

PROPERTIES = ['velocityMin','velocityMax','angleMin','angleMax']

class Explosion
  include([
    Inlinable(
      inlinedProperties: PROPERTIES
      rename:
        random: 'explosionRandom'
      mapSource:
        constructor: 'this.random = @random;'
    )
    Cloneable.apply(null, PROPERTIES.concat('random'))
    Sourcable.apply(
      null, ['particlejs.Explosion'].concat(PROPERTIES).concat('random')
    )
    Randomizable
  ]).in Explosion

  constructor: (@velocityMin=0,
                @velocityMax=1,
                @angleMin=0,
                @angleMax=Math.PI*2,
                @random) -> @initRandom()

  initialize: (particle) ->
    angle = @random.in @angleMin, @angleMax
    velocity = @random.in @velocityMin, @velocityMax

    particle.velocity.x = Math.cos(angle)*velocity
    particle.velocity.y = Math.sin(angle)*velocity

module.exports = Explosion
