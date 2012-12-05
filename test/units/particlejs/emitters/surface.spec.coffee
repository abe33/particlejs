require '../../../test_helper'

{Random, NoRandom} = require 'chancejs'
{Rectangle} = require 'geomjs'
Surface = require '../../../../lib/particlejs/emitters/surface'

describe 'Surface', ->
  describe 'when instanciated with a surface and a randomizer', ->
    beforeEach ->
      @emitter = new Surface new Rectangle 0, 0, 10, 10
      @emitter.random = new Random new NoRandom 0.5

    it 'should return a point within the surface', ->
      pt = @emitter.get()
      expect(pt.x).toBe(5)
      expect(pt.y).toBe(5)

