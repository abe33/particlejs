System = require './system'

class SubSystem extends System
  constructor: (initializer, action, @emissionFactory, subSystem) ->
    super initializer, action, subSystem

  emitFor: (particle) -> @emit @emissionFactory particle

module.exports = SubSystem
