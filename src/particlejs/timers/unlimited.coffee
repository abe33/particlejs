
mixinsjs = require 'mixinsjs'

{Sourcable, Cloneable, include} = mixinsjs
Inlinable = require '../mixins/inlinable'
Limited = require './limited'

class Unlimited extends Limited
  include([
    Inlinable(inlinedProperties: ['duration','since'], super: true)
    Cloneable('since')
    Sourcable('particlejs.Unlimited','since')
  ]).in Unlimited

  constructor: (since) -> super Infinity, since
  finished: -> false

module.exports = Unlimited
