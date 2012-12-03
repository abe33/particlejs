Neat = require 'neat'
Neat.require 'core'
{findSync} = Neat.require "utils/files"

global.testProperty = (source, property) ->
  shouldBe: (value) ->
    describe "its #{property} property", ->
      it "should be #{value}", ->
        expect(Math.abs(this[source][property] - value) < 0.00001).toBeTruthy()

paths = Neat.paths.map (p) -> "#{p}/test/helpers"
files = findSync 'coffee', paths
files.forEach (f) -> require f
