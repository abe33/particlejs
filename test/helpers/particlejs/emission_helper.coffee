
global.emission = (source) ->
  shouldBe:
    iterable: (times, max=100) ->
      it "should behave as an iterator with #{times} iterations", ->
        n = 0
        target = this[source]
        while target.hasNext()
          target.next()
          n++
          break if n > max

        expect(n).toBe(times)

