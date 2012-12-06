require '../../../test_helper'

Fixed = require '../../../../lib/particlejs/counters/fixed'

describe 'Fixed', ->
  describe 'when instanciated with a value', ->
    it 'should always return the same value', ->
      value = 15
      counter = new Fixed value

      counter.prepare 100, 0.1, 100
      expect(counter.count).toBe(value)

      counter.prepare 400, 0.4, 500
      expect(counter.count).toBe(value)

