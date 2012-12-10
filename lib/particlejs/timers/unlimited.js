(function() {
  var Cloneable, Inlinable, Limited, Sourcable, Unlimited, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  Limited = require('./limited');

  Unlimited = (function(_super) {

    __extends(Unlimited, _super);

    include([
      Inlinable({
        inlinedProperties: ['duration', 'since'],
        "super": true
      }), Cloneable('since'), Sourcable('particlejs.Unlimited', 'since')
    ])["in"](Unlimited);

    function Unlimited(since) {
      Unlimited.__super__.constructor.call(this, Infinity, since);
    }

    Unlimited.prototype.finished = function() {
      return false;
    };

    return Unlimited;

  })(Limited);

  module.exports = Unlimited;

}).call(this);
