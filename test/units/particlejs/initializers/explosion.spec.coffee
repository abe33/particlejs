require '../../../test_helper'

{Random, NoRandom} = require 'chancejs'
Explosion = require '../../../../lib/particlejs/initializers/explosion'
Particle = require '../../../../lib/particlejs/particle'

describe 'Explosion', ->
  source = 'initializer'
  describe 'when instanciated with radii, full angle and random', ->
    beforeEach ->
      @initializer = new Explosion(
        0, 10, 0, 1,
        new Random(new NoRandom(0.5))
      )
      @particle = new Particle
      @particle.init()
      @initializer.initialize @particle

    it 'should define the particle velocity', ->
      expect(@particle.velocity.x).toBe(Math.cos(0.5)*5)
      expect(@particle.velocity.y).toBe(Math.sin(0.5)*5)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Explosion(0,10,0,1,new chancejs.Random(new chancejs.NoRandom(0.5)))')

    sourceOf(source).for('constructor')
    .shouldBe('this.explosionRandom = new chancejs.Random(new chancejs.NoRandom(0.5));')

    sourceOf(source).for('initialize')
    .shouldBe('''var angle, velocity;
angle = this.explosionRandom["in"](0, 1);
velocity = this.explosionRandom["in"](0, 10);
particle.velocity.x = Math.cos(angle) * velocity;
particle.velocity.y = Math.sin(angle) * velocity;''')


  describe 'when instanciated without random', ->
    it 'should set a default one', ->
      expect(new Explosion().random).toBeDefined()

