mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

class MacroInitializer
  include([
    Inlinable(
      mapSource:
        constructor: ->
          @initializers.map((i) -> i.sourceFragment 'constructor').join('\n')
        initialize: ->
          @initializers.map((i) -> i.sourceFragment 'initialize').join('\n')
    )
    Cloneable('initializers')
    Sourcable('particlejs.MacroInitializer','initializers')
  ]).in MacroInitializer

  constructor: (@initializers) ->

  initialize: (particle) ->
    initializer.initialize particle for initializer in @initializers

module.exports = MacroInitializer
