require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Friction = require '../../../../lib/particlejs/actions/friction'

describe 'Friction', ->
  describe 'when called with an amount', ->
    source = 'action'
    beforeEach ->
      @action = new Friction 0.5

    it 'should apply friction to the particle velocity', ->
      particle = new Particle
      particle.init()
      particle.velocity.x = 10
      particle.velocity.y = 10

      @action.prepare 500, 0.5, 500
      @action.process particle

      expect(particle.velocity.x).toBe(7.5)
      expect(particle.velocity.y).toBe(7.5)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Friction(0.5)')

    sourceOf(source).for('constructor').shouldBe('')
    sourceOf(source).for('prepare').shouldBe('')

    sourceOf(source).for('process')
    .shouldBe('''particle.velocity.x -= particle.velocity.x * biasInSeconds * 0.5;
particle.velocity.y -= particle.velocity.y * biasInSeconds * 0.5;''')
