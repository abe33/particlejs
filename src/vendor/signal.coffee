class Signal
  constructor:->
    @listeners = []

  add:( listener, context, priority = 0 )->
    if not @registered listener, context
      @listeners.push [ listener, context, false, priority ]
      @sortListeners()

  addOnce:( listener, context, priority = 0 )->
    if not @registered listener, context
      @listeners.push [ listener, context, true, priority ]
      @sortListeners()

  remove:( listener, context )->
    if @registered listener, context
      @listeners.splice @indexOf( listener, context ), 1

  removeAll:->
    @listeners = []

  indexOf:( listener, context )->
    return i for [l,c],i in @listeners when listener is l and context is c
    -1

  registered:( listener, context )->
    @indexOf( listener, context ) isnt -1

  sortListeners:->
    return if @listeners.length <= 1
    @listeners.sort ( a, b )->
      [ pA, pB ] = [ a[3], b[3] ]

      if pA < pB then 1 else if pB < pA then -1 else 0

  dispatch:->
    listeners = @listeners.concat()
    for [ listener, context, once, priority ] in listeners
      listener.apply context, arguments
      @remove listener, context if once

module.exports = Signal
