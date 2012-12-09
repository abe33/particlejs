require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Friction = require '../../../../lib/particlejs/actions/friction'

describe 'Friction', ->
  describe 'when called with an amount', ->
    it 'should apply friction to the particle velocity', ->
      particle = new Particle
      particle.init()
      particle.velocity.x = 10
      particle.velocity.y = 10

      friction = new Friction 0.5

      friction.prepare 500, 0.5, 500
      friction.process particle

      expect(particle.velocity.x).toBe(7.5)
      expect(particle.velocity.y).toBe(7.5)
