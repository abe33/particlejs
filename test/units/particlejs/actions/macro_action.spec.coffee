require '../../../test_helper'

MacroAction = require '../../../../lib/particlejs/actions/macro_action'
Move = require '../../../../lib/particlejs/actions/move'
Live = require '../../../../lib/particlejs/actions/live'
Particle = require '../../../../lib/particlejs/particle'

describe 'MacroAction', ->
  describe 'when instanciated with several actions', ->
    it 'should call these actions recursively', ->
      particle = new Particle
      particle.init()
      particle.maxLife = 1000
      particle.velocity.x = 100
      particle.velocity.y = 100

      macro = new MacroAction([
        new Move()
        new Live()
      ])

      macro.prepare 100, 0.1, 100
      macro.process particle

      expect(particle.position.x).toBe(10)
      expect(particle.position.y).toBe(10)
      expect(particle.life).toBe(100)
