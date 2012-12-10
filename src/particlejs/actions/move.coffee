mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
BaseAction = require './base_action'

class Move extends BaseAction
  include([
    Inlinable(noconstructor: true)
    Cloneable()
    Sourcable('particlejs.Move')
  ]).in Move

  process: (particle) ->
    particle.lastPosition.x = particle.position.x
    particle.lastPosition.y = particle.position.y
    particle.position.x += particle.velocity.x * @biasInSeconds
    particle.position.y += particle.velocity.y * @biasInSeconds

module.exports = Move
