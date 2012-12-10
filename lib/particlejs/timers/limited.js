(function() {
  var Cloneable, Inlinable, Limited, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Limited = (function() {

    include([
      Inlinable({
        inlinedProperties: ['duration', 'since']
      }), Cloneable('duration', 'since'), Sourcable('particlejs.Limited', 'duration', 'since')
    ])["in"](Limited);

    function Limited(duration, since) {
      this.duration = duration != null ? duration : 1000;
      this.since = since != null ? since : 0;
      this.elapsed = 0;
      this.nextTime = 0;
    }

    Limited.prototype.prepare = function(bias, biasInSeconds, time) {
      if (!this.firstTime) {
        this.nextTime = this.since + bias;
        this.firstTime = true;
      } else {
        this.nextTime = bias;
      }
      return this.elapsed += bias;
    };

    Limited.prototype.finished = function() {
      return this.elapsed >= this.duration;
    };

    return Limited;

  })();

  module.exports = Limited;

}).call(this);
