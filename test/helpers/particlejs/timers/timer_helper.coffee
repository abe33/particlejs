
global.timer = (source) ->
  duration: testProperty source, 'duration'
  since: testProperty source, 'since'
  time: testProperty source, 'time'
  nextTime: testProperty source, 'nextTime'

  should:
    not:
      beFinished: ->
        it 'should not be finished yet', ->
          expect(this[source].finished()).toBeFalsy()

    beFinished: ->
      it 'should be finished', ->
        expect(this[source].finished()).toBeTruthy()

