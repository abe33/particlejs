
class ByRate
  constructor: (@rate=1) ->
    @count = 0
    @rest = 0
    @offset = 1

  prepare: (bias, biasInSeconds, time) ->
    @rest += biasInSeconds * @rate
    @count = Math.floor(@rest)
    @rest -= @count
    @count += @offset
    @offset = 0

module.exports = ByRate
