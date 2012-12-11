require '../../../test_helper'

{Point} = require 'geomjs'

Ponctual = require '../../../../lib/particlejs/emitters/ponctual'

describe 'Ponctual', ->
  describe 'when instanciated with a point', ->
    source = 'emitter'
    beforeEach -> @emitter = new Ponctual new Point

    describe 'its get method', ->
      it 'should return a copy of the specified point', ->
        pt = @emitter.get()
        expect(pt.x).toEqual(@emitter.point.x)
        expect(pt.y).toEqual(@emitter.point.y)
        expect(pt).not.toBe(@emitter.point)

    cloneable(source).shouldCloneItSelf()
    sourceOf(source).shouldBe('new particlejs.Ponctual(new geomjs.Point(0,0))')

    sourceOf(source).for('constructor')
    .shouldBe('')

    sourceOf(source).for('get')
    .shouldBe('get = new geomjs.Point(0,0);')
