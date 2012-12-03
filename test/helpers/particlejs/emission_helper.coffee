
global.emission = (source) ->
  system:
    shouldBe: (system) ->
      it "should have its system define with #{system}", ->
        expect(this[source].system).toBe(this[system])

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
