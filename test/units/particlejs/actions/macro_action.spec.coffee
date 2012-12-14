require '../../../test_helper'

MacroAction = require '../../../../lib/particlejs/actions/macro_action'
Move = require '../../../../lib/particlejs/actions/move'
Live = require '../../../../lib/particlejs/actions/live'
Particle = require '../../../../lib/particlejs/particle'

describe 'MacroAction', ->
  describe 'when instanciated with several actions', ->
    source = 'action'
    beforeEach ->
      @action = new MacroAction([
        new Move()
        new Live()
      ])

    it 'should call these actions recursively', ->
      particle = new Particle
      particle.init()
      particle.maxLife = 1000
      particle.velocity.x = 100
      particle.velocity.y = 100

      @action.prepare 100, 0.1, 100
      @action.process particle

      expect(particle.position.x).toBe(10)
      expect(particle.position.y).toBe(10)
      expect(particle.life).toBe(100)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.MacroAction([new particlejs.Move(),new particlejs.Live()])')

    sourceOf(source).for('constructor').shouldBe('')
    sourceOf(source).for('prepare').shouldBe('')

    sourceOf(source).for('process')
    .shouldBe('''particle.lastPosition.x = particle.position.x;
particle.lastPosition.y = particle.position.y;
particle.position.x += particle.velocity.x * biasInSeconds;
particle.position.y += particle.velocity.y * biasInSeconds;
particle.life += bias;
if (particle.life >= particle.maxLife) {
particle.die();
}''')
