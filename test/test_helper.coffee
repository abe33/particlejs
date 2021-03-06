Neat = require 'neat'
Neat.require 'core'
{findSync} = Neat.require "utils/files"

Impulse = require '../lib/vendor/impulse'
Impulse::start = ->
time = 0
global.animate = (t) -> Impulse.instance().dispatch(t, t / 1000, time += t)

global.testProperty = (source, property) ->
  shouldBe: (value) ->
    describe "#{source} #{property} property", ->
      beforeEach ->
        @addMatchers
          notText: -> if @isNot then " not" else ""

          toBeClose: (value) ->
            @message = ->
              "Expected #{@actual}
               #{if @isNot then " not" else ""}
               to be equal to #{value}
               with a precision of 1e-10".squeeze()

            Math.deltaBelowRatio(@actual, value)

      it "should be #{value}", ->
        expect(this[source][property]).toBeClose(value)

paths = Neat.paths.map (p) -> "#{p}/test/helpers"
files = findSync 'coffee', paths
files.forEach (f) -> require f
