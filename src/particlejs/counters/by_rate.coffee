
class ByRate
  constructor: (@rate=1) ->
    @count = 0
    @rest = 0

  prepare: (bias, biasInSeconds, time) ->
    @rest += biasInSeconds * @rate
    @count = Math.floor @rest
    @rest -= @count

module.exports = ByRate
