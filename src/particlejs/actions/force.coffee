geomjs = require 'geomjs'

Point = geomjs

BaseAction = require './base_action'

class Force extends BaseAction
  constructor: (@vector=new Point) ->
  process: (particle) ->
    particle.velocity.x += @vector.x * @biasInSeconds
    particle.velocity.y += @vector.y * @biasInSeconds

module.exports = Force
