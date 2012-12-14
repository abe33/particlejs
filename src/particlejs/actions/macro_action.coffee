
mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
BaseAction = require './base_action'

mapFragments = (member) -> ->
  @actions.map((i) =>
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

class MacroAction extends BaseAction
  include([
    Inlinable(
      mapSource:
        constructor: -> mapFragments('constructor').call this
        prepare: -> mapFragments('prepare').call this
        process: -> mapFragments('process').call this
    )
    Cloneable('actions')
    Sourcable('particlejs.MacroAction', 'actions')
  ]).in MacroAction

  constructor: (@actions=[]) ->
  prepare: (bias, biasInSeconds, time) ->
    action.prepare bias, biasInSeconds, time for action in @actions
  process: (particle) ->
    action.process particle for action in @actions

module.exports = MacroAction
