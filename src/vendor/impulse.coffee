Signal = require './signal'

requestAnimationFrame = window?.requestAnimationFrame       or
                        window?.webkitRequestAnimationFrame or
                        window?.mozRequestAnimationFrame    or
                        window?.oRequestAnimationFrame      or
                        window?.msRequestAnimationFrame     or
                        (callback) -> setTimeout callback, 1000 / 60

class Impulse extends Signal
  @instance: -> @_instance ||= new Impulse

  constructor: (@timeScale=1) ->
    super()
    @running = false

  add: (listener, context, priority=0) ->
    super listener, context, priority
    @start() if @hasListeners() and not @running

  remove: (listener, context, priority=0) ->
    super listener, context, priority
    @stop() if @running and not @hasListeners()

  hasListeners: ->
    @listeners.length > 0

  start: ->
    @running = true
    @initRun()

  stop: -> @running = false

  initRun: ->
    @time = @getTime()
    requestAnimationFrame => @run()

  run: ->
    if @running
      @stats?.begin()
      t = @getTime()
      s = (t - @time) * @timeScale

      @dispatch s, s / 1000, t
      @initRun()
      @stats?.end()

  getTime: ->
    new Date().getTime()

module.exports = Impulse
