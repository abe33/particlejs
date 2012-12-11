require '../../../test_helper'

Fixed = require '../../../../lib/particlejs/counters/fixed'

describe 'Fixed', ->
  describe 'when instanciated with a value', ->
    source = 'counter'
    beforeEach ->
      @value = 15
      @counter = new Fixed @value

    it 'should always return the same value', ->
      @counter.prepare 100, 0.1, 100
      expect(@counter.count).toBe(@value)

      @counter.prepare 400, 0.4, 500
      expect(@counter.count).toBe(@value)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.Fixed(15)')

    sourceOf(source).for('constructor')
    .shouldBe('')

    sourceOf(source).for('prepare')
    .shouldBe('count = 15;')
