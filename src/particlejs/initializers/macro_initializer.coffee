
class MacroInitializer
  constructor: (@initializers) ->

  initialize: (particle) ->
    initializer.initialize particle for initializer in @initializers

module.exports = MacroInitializer
