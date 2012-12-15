mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
BaseAction = require './base_action'

class Live extends BaseAction
  include([
    Inlinable(noconstructor: true)
    Cloneable()
    Sourcable('particlejs.Live')
  ]).in Live

  process: (particle) ->
    particle.life += @bias
    particle.die() if particle.life >= particle.maxLife

module.exports = Live
