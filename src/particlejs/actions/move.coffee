
BaseAction = require './base_action'

class Move extends BaseAction
  process: (particle) ->
    particle.position.x += particle.velocity.x * @biasInSeconds
    particle.position.y += particle.velocity.y * @biasInSeconds

module.exports = Move
