require '../../../test_helper'

Limited = require '../../../../lib/particlejs/timers/limited'

describe 'Limited', ->
  describe 'when instanciated with a duration of 1000', ->
    source = 'timer'
    beforeEach -> @timer = new Limited 1000

    timer(source).duration.shouldBe(1000)
    timer(source).since.shouldBe(0)
    timer(source).should.not.beFinished()
    timer(source).elapsed.shouldBe(0)
    timer(source).nextTime.shouldBe(0)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.Limited(1000,0)')

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
    .shouldBe('finished = this.elapsed >= 1000;')

    describe 'its prepare method called', ->
      describe 'with a step that does not lead the timer to its end', ->
        beforeEach -> @timer.prepare 500, 0.05, 500

        timer(source).should.not.beFinished()
        timer(source).elapsed.shouldBe(500)
        timer(source).nextTime.shouldBe(500)

      describe 'with a step that lead to the timer end', ->
        beforeEach -> @timer.prepare 1000, 1, 1000

        timer(source).should.beFinished()
        timer(source).elapsed.shouldBe(1000)
        timer(source).nextTime.shouldBe(1000)

    describe 'and a since value of 100', ->
      beforeEach -> @timer = new Limited 1000, 100

      timer(source).duration.shouldBe(1000)
      timer(source).since.shouldBe(100)
      timer(source).should.not.beFinished()
      timer(source).elapsed.shouldBe(0)
      timer(source).nextTime.shouldBe(0)

      describe 'its prepare method called', ->
        describe 'with a step that does not lead the timer to its end', ->
          beforeEach -> @timer.prepare 500, 0.05, 500

          timer(source).should.not.beFinished()
          timer(source).elapsed.shouldBe(500)
          timer(source).nextTime.shouldBe(600)

        describe 'with a step that lead to the timer end', ->
          beforeEach -> @timer.prepare 1000, 1, 1000

          timer(source).should.beFinished()
          timer(source).elapsed.shouldBe(1000)
          timer(source).nextTime.shouldBe(1100)
