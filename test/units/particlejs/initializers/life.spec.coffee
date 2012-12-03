require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Life = require '../../../../lib/particlejs/initializers/life'

describe 'Life', ->
  describe 'when instanciated with a life amount', ->
    beforeEach -> @initializer = new Life 100

    describe 'and its initialize method is called with a particle', ->
      beforeEach ->
        @particle = new Particle()
        @initializer.initialize @particle

      it 'should have set the max life of the particle', ->
        expect(@particle.maxLife).toBe(100)
