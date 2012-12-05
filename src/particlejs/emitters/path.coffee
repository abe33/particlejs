geomjs = require 'geomjs'

class Path
  constructor: (@path) ->

  get: -> @path.pathPointAt @random.get()

module.exports = Path
