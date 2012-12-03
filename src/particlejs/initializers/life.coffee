
class Life
  constructor: (@life) ->

  initialize: (particle) ->
    particle.maxLife = @life

module.exports = Life
