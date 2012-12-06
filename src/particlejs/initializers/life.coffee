Randomizable = require '../mixins/randomizable'

class Life
  Randomizable.attachTo Life

  constructor: (@lifeMin, @lifeMax, @random) ->
    @lifeMax = @lifeMin unless @lifeMax?
    @initRandom()

  initialize: (particle) ->
    if @lifeMin is @lifeMax
      particle.maxLife = @lifeMin
    else
      particle.maxLife = @random.in @lifeMin, @lifeMax

module.exports = Life
