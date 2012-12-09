(function() {
  var BaseAction, Friction,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseAction = require('./base_action');

  Friction = (function(_super) {

    __extends(Friction, _super);

    function Friction(amount) {
      this.amount = amount != null ? amount : 1;
    }

    Friction.prototype.process = function(particle) {
      var fx, fy;
      fx = particle.velocity.x * this.biasInSeconds * this.amount;
      fy = particle.velocity.y * this.biasInSeconds * this.amount;
      particle.velocity.x -= fx;
      return particle.velocity.y -= fy;
    };

    return Friction;

  })(BaseAction);

  module.exports = Friction;

}).call(this);
