require '../../../test_helper'

Instant = require '../../../../lib/particlejs/timers/instant'

describe 'Instant', ->
  describe 'when instanciated', ->
    source = 'timer'
    beforeEach ->
      @timer = new Instant

    it 'should already been finished', ->
      @timer.prepare 500, 0.5, 500
      expect(@timer.nextTime).toBe(0)
      expect(@timer.finished()).toBeTruthy()

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.Instant()')

    sourceOf(source).for('constructor').shouldBe('')
    sourceOf(source).for('prepare').shouldBe('nextTime = 0;')
    sourceOf(source).for('finished').shouldBe('finished = true;')
