geomjs = require 'geomjs'

{Mixin} = geomjs

class Poolable extends Mixin
  @included: (klass) ->

    klass.resetPools = ->
      @allocated = []
      @pooled = []

    klass.get = (defaults={}) ->
      if @pooled.length > 0
        instance = @pooled.shift()
      else
        instance = new klass

      instance.init?()
      instance[k] = v for k,v of defaults
      @allocated.push instance
      instance

    klass.release = (instance) ->
      index = @allocated.indexOf instance
      instance.dispose()
      @allocated.splice index, 1
      @pooled.push instance

    klass.resetPools()

module.exports = Poolable
