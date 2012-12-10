require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Move = require '../../../../lib/particlejs/actions/move'

describe 'Move', ->
  source = 'action'
  beforeEach ->
    @action = new Move

  describe 'when passed a particle', ->
    it 'should update its position based on time and velocity', ->
      particle = new Particle
      particle.init()
      particle.position.x = -100
      particle.position.y = -100
      oldPos = particle.position.clone()
      particle.velocity.x = 100
      particle.velocity.y = 100

      @action.prepare 100, 0.1, 100
      @action.process particle

      expect(particle.position.x).toBe(-90)
      expect(particle.position.y).toBe(-90)
      expect(particle.lastPosition.x).toBe(oldPos.x)
      expect(particle.lastPosition.y).toBe(oldPos.y)

  cloneable(source).shouldCloneItSelf()
  sourceOf(source).shouldBe('new particlejs.Move()')

  sourceOf(source).for('constructor').shouldBe('')
  sourceOf(source).for('prepare').shouldBe('')
  sourceOf(source).for('process')
  .shouldBe("""particle.lastPosition.x = particle.position.x;
particle.lastPosition.y = particle.position.y;
particle.position.x += particle.velocity.x * biasInSeconds;
particle.position.y += particle.velocity.y * biasInSeconds;""")

