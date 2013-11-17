(function(){
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
})()
