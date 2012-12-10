require '../../../test_helper'

Unlimited = require '../../../../lib/particlejs/timers/unlimited'

describe 'Unlimited', ->
  describe 'when instanciated with a duration of 1000', ->
    source = 'timer'
    beforeEach -> @timer = new Unlimited

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.Unlimited(0)')

    sourceOf(source).for('constructor')
    .shouldBe('this.elapsed = 0;')

    sourceOf(source).for('prepare')
    .shouldBe('''if (!this.firstTime) {
  nextTime = 0 + bias;
  this.firstTime = true;
} else {
  nextTime = bias;
}
this.elapsed += bias;''')

    sourceOf(source).for('finished')
    .shouldBe('finished = false;')
