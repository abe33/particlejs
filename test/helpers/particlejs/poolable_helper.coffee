
global.testPoolable = (klass) ->
  with: (parameters) ->
    describe 'get method', ->
      describe 'called with parameters', ->
        beforeEach -> @instance = klass.get parameters
        afterEach -> klass.resetPools()

        it 'should return a parameterized instance', ->
          expect(@instance).toBeDefined()
          for k,v of parameters
            expect(@instance[k]).toBe(v)

        it 'should have added one instance in the allocated pool', ->
          expect(klass.allocated.length).toBe(1)

        describe 'when an instance is released', ->
          beforeEach -> klass.release @instance

          it 'should have removed that instance from the allocated pool', ->
            expect(klass.allocated.length).toBe(0)

          it 'should have added that instance in the waiting pool', ->
            expect(klass.pooled.length).toBe(1)

          describe 'requesting a new instance', ->
            it 'should return the previously pooled instance', ->
              expect(klass.get()).toBe(@instance)



