require '../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../lib/particlejs/particle'
Limited = require '../../../lib/particlejs/timers/limited'
ByRate = require '../../../lib/particlejs/counters/by_rate'
Ponctual = require '../../../lib/particlejs/emitters/ponctual'
Life = require '../../../lib/particlejs/initializers/life'
Live = require '../../../lib/particlejs/actions/live'
Emission = require '../../../lib/particlejs/emission'

System = require '../../../lib/particlejs/system'

describe 'System', ->
  describe 'when instanciated with all its components', ->
    beforeEach ->
      @initializer = initializer = new Life 100
      @action = action = new Live
      @system = new System(initializer, action)

    it 'should exist', ->
      expect(@system).toBeDefined()
      expect(@system.initializer).toBe(@initializer)
      expect(@system.action).toBe(@action)
