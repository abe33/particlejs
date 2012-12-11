require '../../test_helper'

{Point} = require 'geomjs'
Particle = require '../../../lib/particlejs/particle'
Limited = require '../../../lib/particlejs/timers/limited'
ByRate = require '../../../lib/particlejs/counters/by_rate'
Ponctual = require '../../../lib/particlejs/emitters/ponctual'
Life = require '../../../lib/particlejs/initializers/life'

Emission = require '../../../lib/particlejs/emission'

describe 'Emission', ->
  describe 'when instanciated with all components', ->
    source = 'emission'
    beforeEach ->
      @emitter = emitter = new Ponctual(new Point)
      @timer = timer = new Limited(1000)
      @counter = counter = new ByRate(10)
      @initializer = initializer = new Life(100)
      @emission = new Emission(Particle, emitter, timer, counter, initializer)

    it 'should have stored the passed-in arguments', ->
      expect(@emission.particleType).toBe(Particle)
      expect(@emission.emitter).toBe(@emitter)
      expect(@emission.timer).toBe(@timer)
      expect(@emission.counter).toBe(@counter)
      expect(@emission.initializer).toBe(@initializer)

    describe 'when its prepare method is called', ->
      beforeEach -> @emission.prepare 500, 0.5, 500

      it 'should have setup the emission based on its components', ->
        expect(@emission.currentCount).toBe(6)
        expect(@emission.currentTime).toBe(500)

      emission('emission').shouldBe.iterable(6)

      it 'should not have finished', ->
        expect(@emission.finished()).toBeFalsy()

      describe 'with a step that lead to the end of its time', ->
        beforeEach -> @emission.prepare 500, 0.5, 500

        it 'should have finished', ->
          expect(@emission.finished()).toBeTruthy()

      describe 'its next method called in a loop', ->
        it 'should return particles that have been initialized', ->
          e = @emission
          n = 0
          max = 100
          while e.hasNext()
            particle = e.next()
            expect(particle.maxLife).toBe(100)
            expect(particle.position.x).toBe(@emitter.point.x)
            expect(particle.position.y).toBe(@emitter.point.y)

            n++
            break if n > max

      describe 'its nextTime method called in a loop', ->
        it 'should provides stepped time', ->
          e = @emission
          n = 0
          max = 100
          while e.hasNext()
            time = e.nextTime()
            expect(time)
            .toBe(e.currentTime - e.iterator / e.currentCount * e.currentTime)

            e.next()
            n++
            break if n > max

    cloneable(source).shouldCloneItSelf()
    sourceOf(source)
    .shouldBe('new particlejs.Emission(particlejs.Particle,new particlejs.Ponctual(new geomjs.Point(0,0)),new particlejs.Limited(1000,0),new particlejs.ByRate(10),new particlejs.Life(100,100,new chancejs.Random(new chancejs.MathRandom())))')

    compilable(source)
    .should.compileTo('''(function(){
    var emission = {
      init: function(){
        this.elapsed = 0;
        this.rest = 0;
        this.offset = 1;
        this.lifeRandom = new chancejs.Random(new chancejs.MathRandom());
      },
      prepare: function(bias, biasInSeconds, time) {
        this.iterator = 0;
        var count = 0, nextTime = 0;

        if (!this.firstTime) {
          nextTime = 0 + bias;
          this.firstTime = true;
        } else {
          nextTime = bias;
        }
        this.elapsed += bias;

        this.rest += biasInSeconds * 10;
        count = Math.floor(this.rest);
        this.rest -= count;
        count += this.offset;
        this.offset = 0;

        this._nextTime = nextTime;
        this.count = count;
      },
      hasNext: function(){
        return this.iterator < this.count;
      },
      next: function(){
        var get, particle;
        get = new geomjs.Point(0,0);
        particle = particlejs.Particle.get({position: get});
        particle.position.x = get.x;
        particle.position.y = get.y;
        particle.maxLife = 100;

        this.iterator++;
        return particle;
      },
      nextTime: function(){
        return this._nextTime;
      },
      finished: function(){
        var finished = true;

        finished = this.elapsed >= 1000;

        return finished;
      }
    };
    emission.init();
    return emission;
  })()''')



