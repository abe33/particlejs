require '../../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../../lib/particlejs/particle'
Limited = require '../../../../lib/particlejs/timers/limited'
ByRate = require '../../../../lib/particlejs/counters/by_rate'
Ponctual = require '../../../../lib/particlejs/emitters/ponctual'
Life = require '../../../../lib/particlejs/initializers/life'
Live = require '../../../../lib/particlejs/actions/live'
Emission = require '../../../../lib/particlejs/emission'

SubSystem = require '../../../../lib/particlejs/sub_system'
ParticleSubSystem = require '../../../../lib/particlejs/initializers/particle_sub_system'

describe 'ParticleSubSystem', ->
  describe 'when instanciated with system components', ->
    beforeEach ->
      @initializer = initializer = new Life 1000
      @action = action = new Live
      @initializer = new ParticleSubSystem(
        initializer, action,
        (p) ->
          new Emission( Particle,
                        new Ponctual(p.position),
                        new Limited(1000,100),
                        new ByRate(10) )
      )

    it 'should have created a new sub system', ->
      expect(@initializer.subSystem).toBeDefined()

    describe 'when its initialize method is called', ->
      beforeEach ->
        @particle = new Particle
        @particle.init()
        @particle.position.x = 10
        @particle.position.y = 10
        @initializer.initialize @particle

      it 'should create a new emission for the given particle', ->
        expect(@initializer.subSystem.emissions.length).toBe(1)
