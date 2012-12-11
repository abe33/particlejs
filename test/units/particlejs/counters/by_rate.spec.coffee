require '../../../test_helper'

ByRate = require '../../../../lib/particlejs/counters/by_rate'

describe 'ByRate', ->
  source = 'counter'
  describe 'when instanciated with a rate', ->
    beforeEach -> @counter = new ByRate 10

    counter(source).count.shouldBe(0)

    byRateCounter(source).rate.shouldBe(10)
    byRateCounter(source).rest.shouldBe(0)

    describe 'when its prepare method is called', ->
      beforeEach -> @counter.prepare 510, 0.51, 510

      counter(source).count.shouldBe(6)
      byRateCounter(source).rest.shouldBe(0.1)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.ByRate(10)')

    sourceOf(source).for('constructor')
    .shouldBe('''count = 0;
this.rest = 0;
this.offset = 1;''')

    sourceOf(source).for('prepare')
    .shouldBe('''this.rest += biasInSeconds * 10;
count = Math.floor(this.rest);
this.rest -= count;
count += this.offset;
this.offset = 0;''')
