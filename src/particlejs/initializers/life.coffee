
mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
Randomizable = require '../mixins/randomizable'

class Life
  include([
    Inlinable(
      inlinedProperties:[ 'lifeMin','lifeMax']
      rename:
        random: 'lifeRandom'
      mapSource:
        constructor: 'this.random = @random;'
        initialize: ->
          if @lifeMax is @lifeMin
            'particle.maxLife = @lifeMin;'
          else
            'particle.maxLife = this.random["in"](@lifeMin, @lifeMax);'
    )
    Cloneable('lifeMin','lifeMax','random')
    Sourcable('particlejs.Life','lifeMin','lifeMax','random')
    Randomizable
  ]).in Life

  constructor: (@lifeMin, @lifeMax, @random) ->
    @lifeMax = @lifeMin unless @lifeMax?
    @initRandom()

  initialize: (particle) ->
    if @lifeMin is @lifeMax
      particle.maxLife = @lifeMin
    else
      particle.maxLife = @random.in @lifeMin, @lifeMax

module.exports = Life
