fs = require 'fs'
{resolve} = require 'path'
require '../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../lib/particlejs/particle'
Limited = require '../../../lib/particlejs/timers/limited'
ByRate = require '../../../lib/particlejs/counters/by_rate'
Ponctual = require '../../../lib/particlejs/emitters/ponctual'
Life = require '../../../lib/particlejs/initializers/life'
Live = require '../../../lib/particlejs/actions/live'
Emission = require '../../../lib/particlejs/emission'

System = require '../../../lib/particlejs/system'
SubSystem = require '../../../lib/particlejs/sub_system'

describe 'System,', ->
  source = 'system'
  subSource = 'subSystem'
  describe 'when instanciated with all its components,', ->

    beforeEach ->
      @initializer = initializer = new Life 1000
      @action = action = new Live
      @subSystem = subSystem = new SubSystem initializer, action, (p) ->
        new Emission( Particle,
                      new Ponctual(p.position),
                      new Limited(1000,100),
                      new ByRate(10) )
      @system = new System(initializer, action, subSystem)

    createListener()

    it 'should exist', ->
      expect(@system).toBeDefined()
      expect(@system.initializer).toBe(@initializer)
      expect(@system.action).toBe(@action)

    system(source).shouldHave().signal('particlesCreated')
    system(source).shouldHave().signal('particlesDied')
    system(source).shouldHave().signal('emissionStarted')
    system(source).shouldHave().signal('emissionFinished')

    system(source).shouldHave(0).particles()
    system(source).shouldHave(0).emissions()

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.System(new particlejs.Life(1000,1000,new chancejs.Random(new chancejs.MathRandom())),new particlejs.Live(),new particlejs.SubSystem(new particlejs.Life(1000,1000,new chancejs.Random(new chancejs.MathRandom())),new particlejs.Live(),function (p) {\n
  return new Emission(Particle, new Ponctual(p.position), new Limited(1000, 100), new ByRate(10));\n
}))')

    sourceFile = resolve __filename, '../../../fixtures/particlejs/compiled_system.js'
    compilable(source).should.compileTo(fs.readFileSync(sourceFile).toString())

    describe 'when its emit method is called', ->
      describe 'with an emission whose timer have since defined,', ->
        beforeEach ->
          @emission = new Emission( Particle,
                                    new Ponctual(new Point),
                                    new Limited(1000,100),
                                    new ByRate(10) )
          @system.emit @emission
          @particle = @system.particles[0]

        afterEach -> @system.stop()

        system(source).shouldHave(2).particles()
        system(source).shouldHave(1).emissions()
        system(source).shouldHave().dispatched('emissionStarted')
        system(source).shouldHave().dispatched('particlesCreated')
        system(source).shouldHave().started()
        system(source).should.emitting()


        emission('emission').system.shouldBe(source)
        particle('particle').maxLife.shouldBe(1000)
        particle('particle').life.shouldBe(100)

        describe 'when animating the system until the emission end,', ->
          beforeEach -> animate 1000

          system(source).should.not.emitting()
          system(source).shouldHave(10).particles()
          system(source).shouldHave(0).emissions()
          system(source).shouldHave().dispatched('emissionFinished')
          system(source).shouldHave().dispatched('particlesDied')

          system(subSource).shouldHave(4).particles()
          system(subSource).shouldHave(2).emissions()

        describe 'when adding a second emission after some time,', ->
          beforeEach ->
            animate 500
            @system.emit new Emission(Particle)

            system(source).shouldHave(2).emissions()

            describe 'when animating past the life of the first emission,', ->
              beforeEach -> animate 600

              system(source).shouldHave(1).emissions()
