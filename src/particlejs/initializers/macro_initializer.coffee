mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'

mapFragments = (member) -> ->
  @initializers.map((i) =>
    s = if i.sourceFragment?
      i.sourceFragment member
    else
      if i[member] is Object
        ''
      else
        a = i[member].toString().split('\n')
        a.shift()
        a.pop()
        a.join('\n')
  ).join('\n')

class MacroInitializer
  include([
    Inlinable(
      mapSource:
        constructor: -> mapFragments('constructor').call this
        initialize: -> mapFragments('initialize').call this
    )
    Cloneable('initializers')
  ]).in MacroInitializer

  constructor: (@initializers) ->

  initialize: (particle) ->
    initializer.initialize particle for initializer in @initializers

  toSource: ->
    name = 'particlejs.MacroInitializer'
    params = @initializers.map (initializer) ->
      if initializer.toSource? then initializer.toSource() else initializer

    "new #{name}([#{params.join ','}])"

module.exports = MacroInitializer
