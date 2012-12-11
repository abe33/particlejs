require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Life = require '../../../../lib/particlejs/initializers/life'
{Random, NoRandom} = require 'chancejs'

describe 'Life', ->
  describe 'when instanciated with a life amount', ->
    source = 'initializer'
    beforeEach -> @initializer = new Life 100

    describe 'and its initialize method is called with a particle', ->
      beforeEach ->
        @particle = new Particle()
        @initializer.initialize @particle

      it 'should have set the max life of the particle', ->
        expect(@particle.maxLife).toBe(100)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Life(100,100,new chancejs.Random(new chancejs.MathRandom()))')

    sourceOf(source).for('initialize')
    .shouldBe('''if (100 === 100) {
  particle.maxLife = 100;
} else {
  particle.maxLife = this.random["in"](100, 100);
}''')

  describe 'when instanciated with a life range', ->
    beforeEach -> @initializer = new Life 100, 200, new Random new NoRandom 0.5

    describe 'and its initialize method is called with a particle', ->
      beforeEach ->
        @particle = new Particle()
        @initializer.initialize @particle

      it 'should have set the max life of the particle within the range', ->
        expect(@particle.maxLife).toBe(150)

    describe 'when instanciated with nothing', ->
      it 'should have set a default random object', ->
        expect(new Life().random).toBeDefined()
