geomjs = require 'geomjs'
mixinsjs = require 'mixinsjs'


{Point} = geomjs
{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
Randomizable = require '../mixins/randomizable'

PROPERTIES = ['velocityMin', 'velocityMax', 'angleRandom']
ARGUMENTS = ['direction'].concat(PROPERTIES).concat('random')

class Stream
  include([
    Inlinable(
      inlinedProperties: PROPERTIES
      rename:
        random: 'streamRandom'
      mapSource:
        constructor: 'this.direction = @direction;\nthis.random = @random;'
    )
    Cloneable.apply(null, ARGUMENTS)
    Sourcable.apply(null, ['particlejs.Stream'].concat ARGUMENTS)
    Randomizable
  ]).in Stream

  constructor: (@direction=new Point(1,1),
                @velocityMin=0,
                @velocityMax=1,
                @angleRandom=0,
                @random) -> @initRandom()

  initialize: (particle) ->
    velocity = @random.in @velocityMin, @velocityMax
    angle = @direction.angle()
    angle += @random.pad @angleRandom if @angleRandom isnt 0

    particle.velocity.x = Math.cos(angle) * velocity
    particle.velocity.y = Math.sin(angle) * velocity

module.exports = Stream
