require '../../../test_helper'

{Point} = require 'geomjs'
Stream = require '../../../../lib/particlejs/initializers/stream'

describe 'Stream', ->
  source = 'initializer'
  describe 'when instanciated with all components', ->
    beforeEach ->
      @initializer = new Stream new Point(1,-3), 40,50,0.2

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Stream(new geomjs.Point(1,-3),40,50,0.2,new chancejs.Random(new chancejs.MathRandom()))')

    sourceOf(source).for('constructor')
    .shouldBe('''this.direction = new geomjs.Point(1,-3);
this.streamRandom = new chancejs.Random(new chancejs.MathRandom());''')

    sourceOf(source).for('initialize')
    .shouldBe('''var angle, velocity;
velocity = this.streamRandom["in"](40, 50);
angle = this.direction.angle();
if (0.2 !== 0) {
angle += this.streamRandom.pad(0.2);
}
particle.velocity.x = Math.cos(angle) * velocity;
particle.velocity.y = Math.sin(angle) * velocity;''')
