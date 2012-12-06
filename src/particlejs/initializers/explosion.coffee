Randomizable = require '../mixins/randomizable'

class Explosion
  Randomizable.attachTo Explosion

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
