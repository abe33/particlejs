mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
BaseAction = require './base_action'

class Friction extends BaseAction
  include([
    Inlinable(noconstructor: true, inlinedProperties: ['amount'])
    Cloneable('amount')
    Sourcable('particlejs.Friction','amount')
  ]).in Friction

  constructor: (@amount=1) ->
  process: (particle) ->
    particle.velocity.x -= particle.velocity.x * @biasInSeconds * @amount
    particle.velocity.y -= particle.velocity.y * @biasInSeconds * @amount

module.exports = Friction
