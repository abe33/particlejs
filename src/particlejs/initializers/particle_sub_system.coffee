
SubSystem = require '../sub_system'

class ParticleSubSystem
  constructor: (initializer, action, emissionFactory, subSystem) ->
    @subSystem = new SubSystem(
      initializer, action, emissionFactory, subSystem
    )

  initialize: (particle) -> @subSystem.emitFor particle

module.exports = ParticleSubSystem
