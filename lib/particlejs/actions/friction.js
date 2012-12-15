(function() {
  var BaseAction, Cloneable, Friction, Inlinable, Sourcable, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  BaseAction = require('./base_action');

  Friction = (function(_super) {

    __extends(Friction, _super);

    include([
      Inlinable({
        noconstructor: true,
        inlinedProperties: ['amount']
      }), Cloneable('amount'), Sourcable('particlejs.Friction', 'amount')
    ])["in"](Friction);

    function Friction(amount) {
      this.amount = amount != null ? amount : 1;
    }

    Friction.prototype.process = function(particle) {
      particle.velocity.x -= particle.velocity.x * this.biasInSeconds * this.amount;
      return particle.velocity.y -= particle.velocity.y * this.biasInSeconds * this.amount;
    };

    return Friction;

  })(BaseAction);

  module.exports = Friction;

}).call(this);
