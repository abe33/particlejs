require '../../../test_helper'

{Random, NoRandom} = require 'chancejs'
Explosion = require '../../../../lib/particlejs/initializers/explosion'
Particle = require '../../../../lib/particlejs/particle'

describe 'Explosion', ->
  describe 'when instanciated with radii, full angle and random', ->
    beforeEach ->
      @initializer = new Explosion(
        0, 10, 0, 1,
        new Random(new NoRandom(0.5))
      )
      @particle = new Particle
      @particle.init()
      @initializer.initialize @particle

    it 'should define the particle velocity', ->
      expect(@particle.velocity.x).toBe(Math.cos(0.5)*5)
      expect(@particle.velocity.y).toBe(Math.sin(0.5)*5)

  describe 'when instanciated without random', ->
    it 'should set a default one', ->
      expect(new Explosion().random).toBeDefined()
