mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Emission = require './emission'

class SubEmission extends Emission
  @source: 'particlejs.SubEmission'

  constructor: (@particle,
                particleType,
                emitter,
                timer,
                counter,
                initializer) ->
    super particleType, emitter, timer, counter, initializer

  getArgumentsSource: ->
    args = ['null', @particleType.source]
    ['emitter','timer','counter','initializer'].forEach (p) =>
      args.push @[p].toSource()

    args

module.exports = SubEmission
