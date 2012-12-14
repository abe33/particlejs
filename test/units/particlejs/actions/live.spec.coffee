require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Live = require '../../../../lib/particlejs/actions/live'

describe 'Live::process', ->
  source = 'action'
  beforeEach ->
    @action = new Live

  it 'should increment the particle life by the amount of time spent', ->
    particle = new Particle
    particle.init()
    particle.maxLife = 100
    @action.prepare 500, 0.5, 500
    @action.process particle

    expect(particle.life).toBe(100)
    expect(particle.dead).toBeTruthy()

  cloneable(source).shouldCloneItSelf()
  sourceOf(source).shouldBe('new particlejs.Live()')

  sourceOf(source).for('constructor').shouldBe('')
  sourceOf(source).for('prepare').shouldBe('')
  sourceOf(source).for('process')
  .shouldBe("""particle.life += bias;
if (particle.life >= particle.maxLife) {
particle.die();
}""")
