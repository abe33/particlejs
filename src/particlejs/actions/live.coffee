
BaseAction = require './base_action'

class Live extends BaseAction
  process: (particle) ->
    particle.life += @bias
    particle.die() if particle.life >= particle.maxLife

module.exports = Live
