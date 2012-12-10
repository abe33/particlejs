(function() {
  var Cloneable, Inlinable, Instant, Sourcable, include, mixinsjs;

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Instant = (function() {

    function Instant() {}

    include([Inlinable(), Cloneable(), Sourcable('particlejs.Instant')])["in"](Instant);

    Instant.prototype.prepare = function() {
      return this.nextTime = 0;
    };

    Instant.prototype.finished = function() {
      return true;
    };

    return Instant;

  })();

  module.exports = Instant;

}).call(this);
