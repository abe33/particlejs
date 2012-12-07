require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Move = require '../../../../lib/particlejs/actions/move'

describe 'Move', ->
  describe 'when passed a particle', ->
    it 'should update its position based on time and velocity', ->
      particle = new Particle
      particle.init()
      particle.position.x = -100
      particle.position.y = -100
      oldPos = particle.position.clone()
      particle.velocity.x = 100
      particle.velocity.y = 100
      move = new Move

      move.prepare 100, 0.1, 100
      move.process particle

      expect(particle.position.x).toBe(-90)
      expect(particle.position.y).toBe(-90)
      expect(particle.lastPosition.x).toBe(oldPos.x)
      expect(particle.lastPosition.y).toBe(oldPos.y)
