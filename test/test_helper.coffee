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

squeeze = (s) -> s.replace /\s+/g, ' '
strip = (s) -> s.replace /(^\s*|\s*$)/g, ''

global.compilable = (source) ->
  should:
    compileTo: (value) ->
      describe "#{source}.compile()", ->
        it "should return '#{value}'", ->
          expect(strip squeeze this[source].compile())
          .toBe(strip squeeze value)

global.cloneable = (source) ->
  shouldCloneItSelf: ->
    describe "#{source}.clone()", ->
      it 'should return a copy of the object', ->
        expect(this[source].clone()).toBeDefined()

global.sourceOf = (source) ->
  shouldBe: (value) ->
    describe "#{source}.toSource()", ->
      it "should return '#{value}'", ->
        expect(strip squeeze this[source].toSource())
        .toBe(strip squeeze value)

  for: (member) ->
    shouldBe: (value) ->
      describe "#{source}.sourceFragment('#{member}')", ->
        it "should return '#{value}'", ->
          expect(strip squeeze this[source].sourceFragment(member))
          .toBe(strip squeeze value)


