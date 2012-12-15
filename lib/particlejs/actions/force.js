(function() {
  var BaseAction, Cloneable, Force, Inlinable, Point, Sourcable, geomjs, include, mixinsjs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  geomjs = require('geomjs');

  mixinsjs = require('mixinsjs');

  Point = geomjs.Point;

  Sourcable = mixinsjs.Sourcable, Cloneable = mixinsjs.Cloneable, include = mixinsjs.include;

  Inlinable = require('../mixins/inlinable');

  BaseAction = require('./base_action');

  Force = (function(_super) {

    __extends(Force, _super);

    include([
      Inlinable({
        rename: {
          vector: 'forceVector'
        },
        mapSource: {
          constructor: 'this.vector = @vector;'
        }
      }), Cloneable('vector'), Sourcable('particlejs.Force', 'vector')
    ])["in"](Force);

    function Force(vector) {
      this.vector = vector != null ? vector : new Point;
    }

    Force.prototype.process = function(particle) {
      particle.velocity.x += this.vector.x * this.biasInSeconds;
      return particle.velocity.y += this.vector.y * this.biasInSeconds;
    };

    return Force;

  })(BaseAction);

  module.exports = Force;

}).call(this);
