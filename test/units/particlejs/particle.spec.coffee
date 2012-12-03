require '../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../lib/particlejs/particle'

describe 'Particle', ->
  beforeEach ->  @particle = particle()

  describe 'when created', ->
    it 'should exist', ->
      expect(@particle).toBeDefined()

    it 'should not have any state', ->
      expect(@particle.life).toBeUndefined()
      expect(@particle.dead).toBeUndefined()
      expect(@particle.maxLife).toBeUndefined()
      expect(@particle.velocity).toBeUndefined()
      expect(@particle.position).toBeUndefined()
      expect(@particle.lastPosition).toBeUndefined()
      expect(@particle.parasites).toBeUndefined()

  describe 'when initialized', ->
    beforeEach -> @particle.init()

    it 'should have defined its default state', ->
      expect(@particle.dead).toBeFalsy()
      expect(@particle.life).toBe(0)
      expect(@particle.maxLife).toBe(0)
      expect(@particle.velocity).toBeDefined()
      expect(@particle.position).toBeDefined()
      expect(@particle.lastPosition).toBeDefined()
      expect(@particle.parasites).toBeDefined()

  describe 'when disposed', ->
    beforeEach ->
      @particle.init()
      @particle.dispose()

    it 'should have nullified all its reference', ->
      expect(@particle.velocity).toBeNull()
      expect(@particle.position).toBeNull()
      expect(@particle.lastPosition).toBeNull()
      expect(@particle.parasites).toBeNull()

  describe 'with a maxLife defined', ->
    beforeEach -> @particle.maxLife = 1000

    describe 'its die method', ->
      beforeEach -> @particle.die()

      it 'should set the particle life to maxLife', ->
        expect(@particle.life).toBe(@particle.maxLife)

      it 'should have set the dead flag to true', ->
        expect(@particle.dead).toBeTruthy()

    describe 'when particle is dead', ->
      beforeEach -> @particle.die()

      describe 'its revive method', ->
        beforeEach -> @particle.revive()

        it 'should reset the life of the particle', ->
          expect(@particle.life).toBe(0)

        it 'should have unset the dead flag', ->
          expect(@particle.dead).toBeFalsy()

  testPoolable(Particle)
  .with
    life: 10
    maxFile: 100
    position: new Point 5, 6
    lastPosition: new Point 7, 8
    velocity: new Point 10, 11

