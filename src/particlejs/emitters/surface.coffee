
class Surface
  constructor: (@surface) ->

  get: -> @surface.randomPointInSurface @random

module.exports = Surface
