require '../../../test_helper'

{Random, NoRandom} = require 'chancejs'
MacroInitializer = require '../../../../lib/particlejs/initializers/macro_initializer'
Particle = require '../../../../lib/particlejs/particle'
Life = require '../../../../lib/particlejs/initializers/life'
Explosion = require '../../../../lib/particlejs/initializers/explosion'

describe 'MacroInitializer', ->
  source = 'initializer'
  describe 'when instanciated with several initializers', ->
    beforeEach ->
      @particle = new Particle
      @initializer = new MacroInitializer([
        new Life(100),
        new Explosion(
          0, 10, 0, 1,
          new Random(new NoRandom(0.5))
        ),
        initialize: (particle) -> particle.parasite.color = '#000000'
      ])
      @particle.init()
      @initializer.initialize @particle

    it 'should call them', ->
      expect(@particle.maxLife).toBe(100)
      expect(@particle.velocity.x).toBe(Math.cos(0.5)*5)
      expect(@particle.velocity.y).toBe(Math.sin(0.5)*5)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.MacroInitializer([new particlejs.Life(100,100,new chancejs.Random(new chancejs.MathRandom())),new particlejs.Explosion(0,10,0,1,new chancejs.Random(new chancejs.NoRandom(0.5))),[object Object]])')

    sourceOf(source).for('constructor')
    .shouldBe('''this.lifeRandom = new chancejs.Random(new chancejs.MathRandom());
this.explosionRandom = new chancejs.Random(new chancejs.NoRandom(0.5));''')

    sourceOf(source).for('initialize')
    .shouldBe('''particle.maxLife = 100;
var angle, velocity;
angle = this.explosionRandom["in"](0, 1);
velocity = this.explosionRandom["in"](0, 10);
particle.velocity.x = Math.cos(angle) * velocity;
particle.velocity.y = Math.sin(angle) * velocity;
particle.parasite.color = '#000000';''')
