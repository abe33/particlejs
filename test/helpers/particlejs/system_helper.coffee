
mockListener = (signal) -> (args...) ->
  global.currentResults[signal] = args

SIGNALS = [
  'particlesCreated'
  'particlesDied'
  'emissionStarted'
  'emissionFinished'
]

global.createListener = ->
  beforeEach ->
    global.currentResults = {}
    SIGNALS.forEach (m) => @system[m].add mockListener m

  afterEach -> SIGNALS.forEach (m) => @system[m].removeAll()

global.system = (source) ->
  should:
    emitting: ->
      it "#{source} should emitting", ->
        expect(this[source].emitting()).toBeTruthy()
    not:
      emitting: ->
        it "#{source} should not emitting", ->
          expect(this[source].emitting()).toBeFalsy()

  shouldHave: (value) ->
    particles: ->
      it "#{source} should have #{value} particles", ->
        expect(this[source].particles.length).toBe(value)
    emissions: ->
      it "#{source} should have #{value} emissions", ->
        expect(this[source].emissions.length).toBe(value)

    signal: (signal) ->
      it "#{source} should have a #{signal} signal", ->
        target = this[source]
        targetSignal = target[signal]
        signalCalled = false
        listener = -> signalCalled = true
        listenersCount = targetSignal.listeners.length

        targetSignal.add listener
        expect(targetSignal.listeners.length).toBe(listenersCount + 1)

        targetSignal.dispatch()
        expect(signalCalled).toBeTruthy()

        targetSignal.remove listener
        expect(targetSignal.listeners.length).toBe(listenersCount)

    dispatched: (signal) ->
      it "#{source} should have dispatched signal #{signal}", ->
        expect(global.currentResults[signal]).toBeDefined()

    started: ->
      it "#{source} should have started", ->
        expect(this[source].running).toBeTruthy()

