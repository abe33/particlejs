Randomizable = require '../mixins/randomizable'

class Surface
  Randomizable.attachTo Surface

  constructor: (@surface, @random) -> @initRandom()

  get: -> @surface.randomPointInSurface @random

module.exports = Surface
