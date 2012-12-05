require '../../../test_helper'

Instant = require '../../../../lib/particlejs/timers/instant'

describe 'Instant', ->
  describe 'when instanciated', ->
    it 'should already been finished', ->
      timer = new Instant
      expect(timer.nextTime()).toBe(0)
      expect(timer.finished()).toBeTruthy()
