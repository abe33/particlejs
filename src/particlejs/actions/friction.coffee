BaseAction = require './base_action'

class Friction extends BaseAction
  constructor: (@amount=1) ->
  process: (particle) ->
    fx = particle.velocity.x * @biasInSeconds * @amount
    fy = particle.velocity.y * @biasInSeconds * @amount

    particle.velocity.x -= fx
    particle.velocity.y -= fy

module.exports = Friction
