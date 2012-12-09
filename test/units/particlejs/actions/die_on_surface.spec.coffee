require '../../../test_helper'

{Rectangle} = require 'geomjs'
DieOnSurface = require '../../../../lib/particlejs/actions/die_on_surface'
Particle = require '../../../../lib/particlejs/particle'

describe 'DieOnSurface', ->
  describe 'when instanciated with a surface', ->
    it 'should kill the particle on contact', ->
      particle = new Particle
      particle.init()
      action = new DieOnSurface new Rectangle 1,1,10,10

      action.process particle
      expect(particle.dead).not.toBeTruthy()

      particle.position.x = 5
      particle.position.y = 5
      action.process particle
      expect(particle.dead).toBeTruthy()



