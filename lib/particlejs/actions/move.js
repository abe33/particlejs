(function() {
  var BaseAction, Cloneable, Inlinable, Move, Sourcable, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixinsjs = require('mixinsjs');

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  BaseAction = require('./base_action');

  Move = (function(_super) {

    __extends(Move, _super);

    function Move() {
      return Move.__super__.constructor.apply(this, arguments);
    }

    include([
      Inlinable({
        noconstructor: true
      }), Cloneable(), Sourcable('particlejs.Move')
    ])["in"](Move);

    Move.prototype.process = function(particle) {
      particle.lastPosition.x = particle.position.x;
      particle.lastPosition.y = particle.position.y;
      particle.position.x += particle.velocity.x * this.biasInSeconds;
      return particle.position.y += particle.velocity.y * this.biasInSeconds;
    };

    return Move;

  })(BaseAction);

  module.exports = Move;

}).call(this);
