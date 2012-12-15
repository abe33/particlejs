require '../../../test_helper'

{Rectangle} = require 'geomjs'
DieOnSurface = require '../../../../lib/particlejs/actions/die_on_surface'
Particle = require '../../../../lib/particlejs/particle'

describe 'DieOnSurface', ->
  describe 'when instanciated with a surface', ->
    source = 'action'

    beforeEach ->
      @action = new DieOnSurface new Rectangle 1,1,10,10

    it 'should kill the particle on contact', ->
      particle = new Particle
      particle.init()

      @action.process particle
      expect(particle.dead).not.toBeTruthy()

      particle.position.x = 5
      particle.position.y = 5
      @action.process particle
      expect(particle.dead).toBeTruthy()


    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.DieOnSurface([new geomjs.Rectangle(1,1,10,10,0)])')

    sourceOf(source).for('constructor')
    .shouldBe('this.deathSurfaces = [new geomjs.Rectangle(1,1,10,10,0)];')
    sourceOf(source).for('prepare').shouldBe('')

    sourceOf(source).for('process')
    .shouldBe('''var surface, _i, _len, _ref;
_ref = this.deathSurfaces;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
surface = _ref[_i];
if (surface.contains(p.position)) {
p.die(); break;
}
}''')
