(function() {
  var Limited;

  Limited = (function() {

    function Limited(duration, since) {
      this.duration = duration != null ? duration : 1000;
      this.since = since != null ? since : 0;
      this.time = 0;
      this.nextTime = 0;
    }

    Limited.prototype.prepare = function(bias, biasInSeconds, time) {
      if (!this.firstTime) {
        this.nextTime = this.since + bias;
        this.firstTime = true;
      } else {
        this.nextTime = bias;
      }
      return this.time += bias;
    };

    Limited.prototype.finished = function() {
      return this.time >= this.duration;
    };

    return Limited;

  })();

  module.exports = Limited;

}).call(this);
