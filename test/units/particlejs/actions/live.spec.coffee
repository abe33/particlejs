require '../../../test_helper'

Particle = require '../../../../lib/particlejs/particle'
Live = require '../../../../lib/particlejs/actions/live'

describe 'Live::process', ->
  it 'should increment the particle life by the amount of time spent', ->
    live = new Live
    particle = new Particle
    particle.init()
    particle.maxLife = 100
    live.prepare 500, 0.5, 500
    live.process particle

    expect(particle.life).toBe(100)
    expect(particle.dead).toBeTruthy()
