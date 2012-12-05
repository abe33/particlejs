require '../../../test_helper'

{LinearSpline, Point} = require 'geomjs'
{Random, NoRandom} = require 'chancejs'
Path = require '../../../../lib/particlejs/emitters/path'

describe 'Path', ->
  describe 'when instanciated with a path and a randomizer', ->
    beforeEach ->
      @emitter = new Path(
        new LinearSpline([new Point(0,0), new Point(10,0)]),
        new Random(new NoRandom(0.5))
      )

    it 'should return a point of the path', ->
      pt = @emitter.get()
      expect(pt.x).toBe(5)
      expect(pt.y).toBe(0)

  describe 'when instanciated without random', ->
    it 'should set a default random object', ->
      expect(new Path().random).toBeDefined()

