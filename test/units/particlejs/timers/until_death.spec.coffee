require '../../../test_helper'

UntilDeath = require '../../../../lib/particlejs/timers/until_death'
Particle = require '../../../../lib/particlejs/particle'

describe 'UntilDeath', ->
  describe 'when instanciated with a particle', ->
    source = 'timer'
    beforeEach ->
      @particle = new Particle
      @particle.init()
      @timer = new UntilDeath @particle

    timer(source).should.not.beFinished()

    describe 'when animated until the particle died', ->
      beforeEach ->
        @timer.prepare 500, 0.5, 500
        @particle.die()

      timer(source).should.beFinished()

