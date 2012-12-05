Randomizable = require '../mixins/randomizable'

class Path
  Randomizable.attachTo Path

  constructor: (@path, @random) -> @initRandom()

  get: -> @path.pathPointAt @random.get()

module.exports = Path
