geomjs = require 'geomjs'

{Point} = geomjs

class Ponctual
  constructor: (@point=new Point) ->
  get: -> @point.clone()

module.exports = Ponctual
