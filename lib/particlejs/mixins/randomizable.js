(function() {
  var DEFAULT_RANDOM, MathRandom, Mixin, Random, Randomizable, chancejs, geomjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  geomjs = require('geomjs');

  chancejs = require('chancejs');

  Mixin = geomjs.Mixin;

  Random = chancejs.Random, MathRandom = chancejs.MathRandom;

  DEFAULT_RANDOM = new Random(new MathRandom);

  Randomizable = (function(_super) {

    __extends(Randomizable, _super);

    function Randomizable() {
      return Randomizable.__super__.constructor.apply(this, arguments);
    }

    Randomizable.prototype.initRandom = function() {
      return this.random || (this.random = DEFAULT_RANDOM);
    };

    return Randomizable;

  })(Mixin);

  module.exports = Randomizable;

}).call(this);
