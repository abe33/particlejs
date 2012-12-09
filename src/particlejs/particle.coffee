geomjs = require 'geomjs'

{Point} = geomjs
Poolable = require './mixins/poolable'

class Particle
  Poolable.attachTo Particle

  init: ->
    @dead = false
    @life = 0
    @maxLife = 0
    @position = new Point
    @lastPosition = new Point
    @velocity = new Point
    @parasite = {}

  dispose: ->
    @position = null
    @lastPosition = null
    @velocity = null
    @parasite = null

  die: ->
    @dead = true
    @life = @maxLife

  revive: ->
    @dead = false
    @life = 0

module.exports = Particle
