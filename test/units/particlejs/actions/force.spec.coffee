require '../../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../../lib/particlejs/particle'
Force = require '../../../../lib/particlejs/actions/force'

describe 'Force', ->
  describe 'Created with a vector', ->
    source = 'action'
    beforeEach ->
      @action = new Force new Point 10, 10
    it 'should modify the particle velocity based on the vector', ->
      particle = new Particle
      particle.init()

      @action.prepare 500, 0.5, 500
      @action.process particle

      expect(particle.velocity.x).toBe(5)
      expect(particle.velocity.y).toBe(5)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Force(new geomjs.Point(10,10))')

    sourceOf(source).for('constructor')
    .shouldBe('this.forceVector = new geomjs.Point(10,10);')
    sourceOf(source).for('prepare').shouldBe('')

    sourceOf(source).for('process')
    .shouldBe('''particle.velocity.x += this.forceVector.x * biasInSeconds;
particle.velocity.y += this.forceVector.y * biasInSeconds;''')
